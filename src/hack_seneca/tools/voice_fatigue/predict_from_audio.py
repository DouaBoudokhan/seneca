"""Small CLI script to predict fatigue from a single audio file using your notebooks' pipeline.

Behavior:
- Loads an audio file (any format librosa supports).
- Pads/truncates to 50s at 8kHz (same as the mel notebook).
- Computes a 196x196 log-mel spectrogram (n_fft=8192, hop_length=4096, n_mels=196).
- Stacks it to 3 channels and runs VGG19 (include_top=False) to extract features.
- Loads PCA and ensemble classifier (tries Google Drive path first, then local path).
- Prints predicted label and predicted probability.

Usage:
python predict_from_audio.py "path/to/file.wav"
"""

import sys
import os
import argparse
import numpy as np
import librosa
from tensorflow.keras.applications import VGG19
from tensorflow.keras.applications.vgg19 import preprocess_input
import joblib

# Config - match the mel notebook
SR = 8000
TARGET_SECONDS = 50
N_MELS = 196
N_FFT = 8192
HOP_LENGTH = 4096

# Paths where artifacts may be found
GDRIVE_DIR = '/content/drive/MyDrive/DATA'
LOCAL_DIR = r'C:\Users\USER\Desktop\crew\models'


def load_audio_fixed_length(path, sr=SR, target_seconds=TARGET_SECONDS):
    y, _ = librosa.load(path, sr=sr)
    target_len = target_seconds * sr
    if len(y) > target_len:
        return y[:target_len]
    if len(y) < target_len:
        pad = np.zeros(target_len - len(y))
        return np.hstack((y, pad))
    return y


def make_log_mel(y, sr=SR, n_fft=N_FFT, hop_length=HOP_LENGTH, n_mels=N_MELS):
    # Use keyword argument for y to be compatible with different librosa versions
    mel = librosa.feature.melspectrogram(y=y, sr=sr, n_fft=n_fft, hop_length=hop_length, n_mels=n_mels)
    log_mel = librosa.power_to_db(mel)
    return log_mel


def extract_vgg_features(log_mel_2d):
    # expects shape (196,196)
    x = np.stack([log_mel_2d, log_mel_2d, log_mel_2d], axis=-1)
    x = np.expand_dims(x, 0).astype('float32')
    # VGG19 expects RGB images preprocessed
    x = preprocess_input(x)
    vgg = VGG19(weights='imagenet', include_top=False, input_shape=(196,196,3))
    for layer in vgg.layers:
        layer.trainable = False
    features = vgg.predict(x)
    features = features.reshape(-1, 6*6*512)
    return features


def find_artifact_dir():
    # prefer Drive if available
    if os.path.exists(GDRIVE_DIR):
        return GDRIVE_DIR
    if os.path.exists(LOCAL_DIR):
        return LOCAL_DIR
    raise FileNotFoundError(f"Neither {GDRIVE_DIR} nor {LOCAL_DIR} exist. Please place pca_women.pkl and ensemble_women.pkl in one of these paths.")


def load_artifacts(artifact_dir=None, pca_path=None, ensemble_path=None):
    # If explicit paths provided, use them
    if pca_path and ensemble_path:
        if not os.path.exists(pca_path) or not os.path.exists(ensemble_path):
            raise FileNotFoundError(f"Provided artifact paths not found: {pca_path}, {ensemble_path}")
    else:
        if artifact_dir is None:
            raise ValueError('artifact_dir or explicit pca and model paths must be provided')
        pca_path = os.path.join(artifact_dir, 'pca_women.pkl')
        ensemble_path = os.path.join(artifact_dir, 'ensemble_women.pkl')
        if not os.path.exists(pca_path) or not os.path.exists(ensemble_path):
            raise FileNotFoundError(f"Missing artifacts in {artifact_dir}. Expected pca_women.pkl and ensemble_women.pkl")

    pca = joblib.load(pca_path)
    ensemble = joblib.load(ensemble_path)
    return pca, ensemble


def predict_from_file(audio_path, pca_path=None, model_path=None):
    y = load_audio_fixed_length(audio_path)
    log_mel = make_log_mel(y)
    if log_mel.shape != (196,196):
        # in case librosa returns differently shaped output, try resizing or raising
        log_mel = librosa.util.fix_length(log_mel, size=196, axis=1)
        log_mel = librosa.util.fix_length(log_mel, size=196, axis=0)
    feats = extract_vgg_features(log_mel)
    if pca_path and model_path:
        pca, ensemble = load_artifacts(pca_path=pca_path, ensemble_path=model_path)
        artifact_dir = os.path.dirname(pca_path)
    else:
        artifact_dir = find_artifact_dir()
        pca, ensemble = load_artifacts(artifact_dir=artifact_dir)
    reduced = pca.transform(feats)
    prob = ensemble.predict_proba(reduced)
    pred = ensemble.predict(reduced)
    # prob shape: (1, n_classes)
    print('Artifact dir:', artifact_dir)
    print('Predicted label:', int(pred[0]))
    try:
        # find positive class prob (if binary and columns are [0,1])
        pos_prob = prob[0][1]
    except Exception:
        pos_prob = prob[0].max()
    print('Predicted probability (positive class or max):', float(pos_prob))


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Predict fatigue from an audio file')
    parser.add_argument('audio', help='Path to audio file (wav, mp3, m4a, etc.)')
    parser.add_argument('--pca', help='Explicit path to pca_women.pkl', default=None)
    parser.add_argument('--model', help='Explicit path to ensemble_women.pkl', default=None)
    args = parser.parse_args()
    # If both explicit artifact paths provided, pass them through; otherwise script will search default locations
    predict_from_file(args.audio, pca_path=args.pca, model_path=args.model)

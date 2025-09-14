from crewai.tools import BaseTool
from typing import Type, Union, Any
from pydantic import BaseModel, Field, validator
import requests
import os
import base64
from datetime import datetime
import json

class FluxImageGeneratorInput(BaseModel):
    """Input schema for FluxImageGenerator."""
    prompt: Union[str, dict, Any] = Field(..., description="A detailed description of the image you want to generate. Be specific about what should be shown in the image.")
    
    @validator('prompt', pre=True)
    def extract_prompt(cls, v):
        """Extract prompt from various input formats."""
        if isinstance(v, dict):
            if 'description' in v:
                return v['description']
            elif 'prompt' in v:
                if isinstance(v['prompt'], dict) and 'description' in v['prompt']:
                    return v['prompt']['description']
                return v['prompt']
        return str(v)

class FluxImageGenerator(BaseTool):
    name: str = "FluxImageGenerator"
    description: str = (
        "Generate images using Azure FLUX.1-Kontext-pro API. Use this tool whenever you need to create visual content "
        "such as fitness illustrations, meal images, exercise demonstrations, or motivational content. "
        "The tool will generate an image based on your text description and save it locally for easy access."
    )
    args_schema: Type[BaseModel] = FluxImageGeneratorInput

    def _run(self, prompt: str) -> str:
        """Generate an image using Azure FLUX.1-Kontext-pro API and save it locally."""
        try:
            # The prompt is already extracted by the pydantic validator
            print(f"🎨 Generating image with prompt: {prompt}")
            
            # Get Azure FLUX configuration from environment
            flux_api_key = os.getenv("AZURE_DALLE_API_KEY")  # Using same env var for consistency
            flux_endpoint = os.getenv("AZURE_DALLE_ENDPOINT")  # Using same env var for consistency
            api_version = os.getenv("AZURE_DALLE_API_VERSION", "2025-04-01-preview")
            
            if not flux_api_key or not flux_endpoint:
                return "Error: Azure FLUX API key or endpoint not configured in environment variables."
            
            # Build the complete endpoint URL for FLUX.1-Kontext-pro
            full_endpoint = f"{flux_endpoint}/openai/deployments/FLUX.1-Kontext-pro/images/generations?api-version={api_version}"
            
            # Prepare the API request
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {flux_api_key}"
            }
            print(f"prompt: {prompt}")
            # Create a clean, professional prompt
            safe_prompt = f"A clean, professional fitness-related image: {prompt}"
            
            payload = {
                "model": "flux.1-kontext-pro",
                "prompt": safe_prompt,
                "size": "1024x1024",
                "n": 1
            }
            
            # Make the API call
            response = requests.post(full_endpoint, headers=headers, json=payload, timeout=60)
            
            if response.status_code != 200:
                error_text = response.text
                return f"Error generating image: API returned status {response.status_code}. {error_text}"
            
            # Parse the response
            result = response.json()
            
            # Extract image data - FLUX returns base64 data directly
            if 'data' not in result or not result['data']:
                return "Error: No image data in API response"
                
            image_data = result['data'][0]
            
            # FLUX.1-Kontext-pro returns base64-encoded response
            if 'b64_json' in image_data and image_data['b64_json']:
                try:
                    # Decode base64 data
                    b64_data = image_data['b64_json']
                    image_bytes = base64.b64decode(b64_data)
                    
                    # Create filename with timestamp
                    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                    filename = f"flux_fitness_image_{timestamp}.png"
                    
                    # Ensure assets/images directory exists
                    assets_dir = os.path.join("assets", "images")
                    os.makedirs(assets_dir, exist_ok=True)
                    
                    # Save the image
                    local_path = os.path.join(assets_dir, filename)
                    full_path = os.path.abspath(local_path)
                    
                    with open(full_path, 'wb') as f:
                        f.write(image_bytes)
                    
                    return f"✅ Image generated and saved successfully! You can view it at: {local_path}"
                    
                except Exception as decode_error:
                    return f"Error decoding base64 image data: {str(decode_error)}"
            
            # Fallback: Handle URL-based response (less common for FLUX)
            elif 'url' in image_data and image_data['url']:
                image_url = image_data['url']
                
                # Download the image
                try:
                    img_response = requests.get(image_url, timeout=30)
                    img_response.raise_for_status()
                    
                    # Create filename with timestamp
                    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                    filename = f"flux_fitness_image_{timestamp}.png"
                    
                    # Ensure assets/images directory exists
                    assets_dir = os.path.join("assets", "images")
                    os.makedirs(assets_dir, exist_ok=True)
                    
                    # Save the image
                    local_path = os.path.join(assets_dir, filename)
                    full_path = os.path.abspath(local_path)
                    
                    with open(full_path, 'wb') as f:
                        f.write(img_response.content)
                    
                    return f"✅ Image generated and saved successfully! You can view it at: {local_path}"
                    
                except Exception as download_error:
                    return f"Image was generated but failed to download and save locally: {str(download_error)}. You can try accessing the original URL: {image_url}"
            
            else:
                return "Error: No valid image URL or base64 data found in API response"
                
        except Exception as e:
            return f"Unexpected error during image generation: {str(e)}"

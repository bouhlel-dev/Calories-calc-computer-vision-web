// Convert file to base64
export const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    // Check if FileReader is supported
    if (!window.FileReader) {
      reject(new Error('FileReader is not supported in this browser'));
      return;
    }

    const reader = new FileReader();
    
    reader.onload = () => {
      const result = reader.result;
      // Ensure result is a valid base64 string
      if (result && typeof result === 'string') {
        resolve(result);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    
    reader.onerror = (error) => {
      console.error('FileReader error:', error);
      reject(new Error('Failed to read file'));
    };
    
    reader.onabort = () => {
      reject(new Error('File reading was aborted'));
    };
    
    try {
      reader.readAsDataURL(file);
    } catch (error) {
      reject(new Error('Failed to start reading file'));
    }
  });
};

// Analyze food image using Gemini API directly
export const analyzeFoodImage = async (base64Image, apiKey) => {
  if (!apiKey) {
    throw new Error('API key is required. Please configure it in settings.');
  }

  const model = 'gemini-2.5-flash-lite';
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  try {
    // Extract base64 data and determine MIME type
    let base64Data = base64Image;
    let mimeType = 'image/jpeg';
    
    if (base64Image.includes(',')) {
      const parts = base64Image.split(',');
      base64Data = parts[1];
      const mimeMatch = parts[0].match(/data:([^;]+);/);
      if (mimeMatch) {
        mimeType = mimeMatch[1];
        if (mimeType.includes('heic') || mimeType.includes('heif')) {
          mimeType = 'image/jpeg';
        }
      }
    }
    
    const requestBody = {
      contents: [{
        parts: [
          {
            text: "Analyze this food image and return a JSON response with the following structure: {\"detected_foods\": [\"food1\", \"food2\"], \"total_calories\": number}. Only identify the food items visible in the image and estimate their total calories. Be specific about the food items you can see."
          },
          {
            inline_data: {
              mime_type: mimeType,
              data: base64Data
            }
          }
        ]
      }]
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please wait a moment and try again.');
      } else if (response.status === 400) {
        throw new Error('Invalid request. Please check your image and try again.');
      } else if (response.status === 403) {
        throw new Error('API key is invalid or has insufficient permissions.');
      } else if (response.status === 500) {
        throw new Error('Server error. Please try again later.');
      }
      
      throw new Error(`API call failed with status: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract the response text from Gemini
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Try to parse JSON from the response
    let parsedResponse;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResponse = JSON.parse(jsonMatch[0]);
      } else {
        parsedResponse = {
          detected_foods: ["Food detected"],
          total_calories: 200
        };
      }
    } catch (parseError) {
      console.warn('Failed to parse JSON response:', parseError);
      parsedResponse = {
        detected_foods: ["Food detected"],
        total_calories: 200
      };
    }

    return {
      items: parsedResponse.detected_foods || [],
      count: parsedResponse.total_calories || 0
    };
    
  } catch (error) {
    console.error('API Error:', error);
    throw new Error(error.message || 'Failed to analyze image');
  }
};

// Calculate macronutrients from calories
export const calculateMacros = (calories) => {
  const proteinCalories = calories * 0.3; // 30% protein
  const carbCalories = calories * 0.4;    // 40% carbs
  const fatCalories = calories * 0.3;     // 30% fat
  
  return {
    protein: proteinCalories / 4, // 4 calories per gram
    carbs: carbCalories / 4,      // 4 calories per gram
    fats: fatCalories / 9         // 9 calories per gram
  };
};

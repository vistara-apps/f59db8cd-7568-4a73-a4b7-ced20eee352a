import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
});

export async function generateDatingBio(input: {
  interests: string[];
  personalityTraits: string[];
  lookingFor: string;
  age?: number;
}): Promise<string[]> {
  const prompt = `Create 3 unique, engaging dating app bios for someone with these characteristics:

Interests: ${input.interests.join(', ')}
Personality traits: ${input.personalityTraits.join(', ')}
Looking for: ${input.lookingFor}
${input.age ? `Age: ${input.age}` : ''}

Guidelines:
- Each bio should be 2-3 sentences
- Make them authentic and conversational
- Include a touch of humor where appropriate
- Highlight unique aspects
- End with a conversation starter or call to action
- Vary the tone and approach for each bio

Return only the 3 bios, separated by "---"`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'google/gemini-2.0-flash-001',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
      max_tokens: 500,
    });

    const response = completion.choices[0]?.message?.content || '';
    return response.split('---').map(bio => bio.trim()).filter(bio => bio.length > 0);
  } catch (error) {
    console.error('Error generating bio:', error);
    throw new Error('Failed to generate dating bio. Please try again.');
  }
}

export async function generateDateIdeas(input: {
  interests: string[];
  location: string;
  vibe: string;
  budget?: string;
}): Promise<Array<{
  title: string;
  description: string;
  category: string;
  estimatedCost: string;
  duration: string;
}>> {
  const prompt = `Generate 4 unique, personalized date ideas based on:

Interests: ${input.interests.join(', ')}
Location: ${input.location}
Desired vibe: ${input.vibe}
${input.budget ? `Budget: ${input.budget}` : ''}

For each date idea, provide:
- Title (creative and specific)
- Description (2-3 sentences explaining the experience)
- Category (e.g., Adventure, Cultural, Romantic, Active, etc.)
- Estimated cost (e.g., Free, $, $$, $$$)
- Duration (e.g., 2-3 hours, Half day, Full day)

Format as JSON array with objects containing: title, description, category, estimatedCost, duration

Make the ideas creative, location-appropriate, and tailored to the interests and vibe.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'google/gemini-2.0-flash-001',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 800,
    });

    const response = completion.choices[0]?.message?.content || '';
    
    // Try to parse JSON response
    try {
      return JSON.parse(response);
    } catch {
      // Fallback parsing if JSON is malformed
      const ideas = response.split('\n\n').filter(idea => idea.trim());
      return ideas.slice(0, 4).map((idea, index) => ({
        title: `Date Idea ${index + 1}`,
        description: idea.trim(),
        category: 'Custom',
        estimatedCost: '$$',
        duration: '2-3 hours'
      }));
    }
  } catch (error) {
    console.error('Error generating date ideas:', error);
    throw new Error('Failed to generate date ideas. Please try again.');
  }
}

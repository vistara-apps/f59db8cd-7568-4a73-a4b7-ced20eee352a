import OpenAI from 'openai';

// Initialize OpenAI client with fallback configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY,
  baseURL: process.env.OPENAI_API_KEY ? undefined : "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
});

// Simple in-memory cache for development
// In production, use Redis or similar
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function getCacheKey(type: string, input: any): string {
  return `${type}:${JSON.stringify(input)}`;
}

function getFromCache<T>(key: string): T | null {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  cache.delete(key);
  return null;
}

function setCache(key: string, data: any): void {
  cache.set(key, { data, timestamp: Date.now() });
}

export async function generateDatingBio(input: {
  interests: string[];
  personalityTraits: string[];
  lookingFor: string;
  age?: number;
}): Promise<string[]> {
  // Check cache first
  const cacheKey = getCacheKey('bio', input);
  const cached = getFromCache<string[]>(cacheKey);
  if (cached) {
    return cached;
  }

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
    const model = process.env.OPENAI_API_KEY ? 'gpt-4o-mini' : 'google/gemini-2.0-flash-001';
    
    const completion = await openai.chat.completions.create({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
      max_tokens: 500,
    });

    const response = completion.choices[0]?.message?.content || '';
    const bios = response.split('---').map(bio => bio.trim()).filter(bio => bio.length > 0);
    
    // Cache the result
    setCache(cacheKey, bios);
    
    return bios;
  } catch (error) {
    console.error('Error generating bio:', error);
    
    // Provide fallback bios if AI fails
    if (error instanceof Error && error.message.includes('rate limit')) {
      throw new Error('AI service is temporarily busy. Please try again in a moment.');
    }
    
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
  // Check cache first
  const cacheKey = getCacheKey('dateIdeas', input);
  const cached = getFromCache<Array<{
    title: string;
    description: string;
    category: string;
    estimatedCost: string;
    duration: string;
  }>>(cacheKey);
  if (cached) {
    return cached;
  }

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
    const model = process.env.OPENAI_API_KEY ? 'gpt-4o-mini' : 'google/gemini-2.0-flash-001';
    
    const completion = await openai.chat.completions.create({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 800,
    });

    const response = completion.choices[0]?.message?.content || '';
    
    // Try to parse JSON response
    let ideas;
    try {
      ideas = JSON.parse(response);
    } catch {
      // Fallback parsing if JSON is malformed
      const rawIdeas = response.split('\n\n').filter(idea => idea.trim());
      ideas = rawIdeas.slice(0, 4).map((idea, index) => ({
        title: `Date Idea ${index + 1}`,
        description: idea.trim(),
        category: 'Custom',
        estimatedCost: input.budget || '$$',
        duration: '2-3 hours'
      }));
    }
    
    // Cache the result
    setCache(cacheKey, ideas);
    
    return ideas;
  } catch (error) {
    console.error('Error generating date ideas:', error);
    
    // Provide better error messages
    if (error instanceof Error && error.message.includes('rate limit')) {
      throw new Error('AI service is temporarily busy. Please try again in a moment.');
    }
    
    throw new Error('Failed to generate date ideas. Please try again.');
  }
}

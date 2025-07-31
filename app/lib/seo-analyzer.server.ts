import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface SeoAnalysisResult {
  seoScore: number;
  metaTitle: string | null;
  metaDescription: string | null;
  hasH1: boolean;
  hasH2: boolean;
  imageCount: number;
  imagesWithAlt: number;
  wordCount: number;
  keywordDensity: number;
  suggestions: string[];
}

export interface SeoItem {
  id: string;
  title: string;
  body?: string;
  metaTitle?: string;
  metaDescription?: string;
  images?: Array<{ alt?: string }>;
  type: 'product' | 'collection' | 'page' | 'blog';
}

export async function analyzeSeo(item: SeoItem): Promise<SeoAnalysisResult> {
  const analysis: SeoAnalysisResult = {
    seoScore: 0,
    metaTitle: item.metaTitle || null,
    metaDescription: item.metaDescription || null,
    hasH1: false,
    hasH2: false,
    imageCount: item.images?.length || 0,
    imagesWithAlt: 0,
    wordCount: 0,
    keywordDensity: 0,
    suggestions: [],
  };

  let score = 0;
  const suggestions: string[] = [];

  // Analyze meta title
  if (item.metaTitle) {
    if (item.metaTitle.length >= 30 && item.metaTitle.length <= 60) {
      score += 20;
    } else if (item.metaTitle.length > 0) {
      score += 10;
      suggestions.push('Meta title should be between 30-60 characters');
    }
  } else {
    suggestions.push('Add a meta title');
  }

  // Analyze meta description
  if (item.metaDescription) {
    if (item.metaDescription.length >= 120 && item.metaDescription.length <= 160) {
      score += 20;
    } else if (item.metaDescription.length > 0) {
      score += 10;
      suggestions.push('Meta description should be between 120-160 characters');
    }
  } else {
    suggestions.push('Add a meta description');
  }

  // Analyze content
  if (item.body) {
    const bodyText = item.body.replace(/<[^>]*>/g, ' '); // Remove HTML tags
    analysis.wordCount = bodyText.split(/\s+/).filter(word => word.length > 0).length;
    
    if (analysis.wordCount >= 300) {
      score += 15;
    } else if (analysis.wordCount >= 100) {
      score += 10;
      suggestions.push('Add more content (aim for 300+ words)');
    } else {
      suggestions.push('Add substantial content');
    }

    // Check for H1/H2 tags
    analysis.hasH1 = item.body.includes('<h1') || item.body.includes('<H1');
    analysis.hasH2 = item.body.includes('<h2') || item.body.includes('<H2');
    
    if (analysis.hasH1) score += 10;
    if (analysis.hasH2) score += 5;
    
    if (!analysis.hasH1) suggestions.push('Add an H1 heading');
    if (!analysis.hasH2) suggestions.push('Add H2 headings for better structure');
  } else {
    suggestions.push('Add content to improve SEO');
  }

  // Analyze images
  if (item.images && item.images.length > 0) {
    analysis.imagesWithAlt = item.images.filter(img => img.alt && img.alt.trim().length > 0).length;
    const altTextPercentage = (analysis.imagesWithAlt / analysis.imageCount) * 100;
    
    if (altTextPercentage === 100) {
      score += 10;
    } else if (altTextPercentage >= 50) {
      score += 5;
      suggestions.push('Add alt text to all images');
    } else {
      suggestions.push('Add descriptive alt text to images');
    }
  }

  // Calculate keyword density (simplified)
  if (item.body && item.title) {
    const titleWords = item.title.toLowerCase().split(/\s+/);
    const bodyText = item.body.toLowerCase().replace(/<[^>]*>/g, ' ');
    const bodyWords = bodyText.split(/\s+/).filter(word => word.length > 2);
    
    let keywordMatches = 0;
    titleWords.forEach(word => {
      if (bodyWords.includes(word)) keywordMatches++;
    });
    
    analysis.keywordDensity = titleWords.length > 0 ? (keywordMatches / titleWords.length) * 100 : 0;
    
    if (analysis.keywordDensity >= 50) {
      score += 10;
    } else if (analysis.keywordDensity >= 25) {
      score += 5;
      suggestions.push('Include more keywords from the title in the content');
    } else {
      suggestions.push('Improve keyword optimization');
    }
  }

  // Bonus points for having both title and description
  if (item.metaTitle && item.metaDescription) {
    score += 10;
  }

  analysis.seoScore = Math.min(100, Math.max(0, score));
  analysis.suggestions = suggestions;

  return analysis;
}

export async function generateAiSuggestions(item: SeoItem): Promise<{
  suggestedTitle: string;
  suggestedDescription: string;
  suggestedContent?: string;
}> {
  const prompt = `
    Generate SEO-optimized content for a ${item.type} titled "${item.title}".
    
    Requirements:
    - Meta title: 30-60 characters, include main keyword
    - Meta description: 120-160 characters, compelling and descriptive
    - Content: 300+ words, well-structured with H1 and H2 tags, include relevant keywords naturally
    
    Current content: ${item.body || 'No content available'}
    
    Please provide:
    1. Meta title
    2. Meta description  
    3. Enhanced content (if current content is weak or missing)
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an SEO expert. Provide concise, actionable suggestions for Shopify store optimization."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content || '';
    
    // Parse the response (this is a simplified parser)
    const lines = response.split('\n').filter(line => line.trim());
    
    return {
      suggestedTitle: lines.find(line => line.toLowerCase().includes('title'))?.replace(/^.*?:/, '').trim() || `Optimized ${item.title}`,
      suggestedDescription: lines.find(line => line.toLowerCase().includes('description'))?.replace(/^.*?:/, '').trim() || `Discover ${item.title} - optimized for search engines`,
      suggestedContent: lines.find(line => line.toLowerCase().includes('content'))?.replace(/^.*?:/, '').trim() || undefined,
    };
  } catch (error) {
    console.error('OpenAI API error:', error);
    return {
      suggestedTitle: `Optimized ${item.title}`,
      suggestedDescription: `Discover ${item.title} - optimized for search engines`,
    };
  }
} 
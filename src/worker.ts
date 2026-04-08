interface Story {
  id: string;
  title: string;
  content: string;
  author: string;
  category: 'origin' | 'vessel' | 'community' | 'vocabulary' | 'artifact';
  createdAt: string;
  upvotes: number;
  tags: string[];
}

interface Contribution {
  title: string;
  content: string;
  author: string;
  category: Story['category'];
  tags: string[];
}

interface LoreEntry {
  id: string;
  term: string;
  definition: string;
  usage: string;
  related: string[];
}

class FleetMythology {
  private stories: Map<string, Story>;
  private lore: Map<string, LoreEntry>;

  constructor() {
    this.stories = new Map();
    this.lore = new Map();
    this.initializeDefaultData();
  }

  private initializeDefaultData(): void {
    const originStory: Story = {
      id: "origin-001",
      title: "The First Convergence",
      content: "When the void between stars whispered secrets, the first vessels emerged not from docks, but from shared dreams. Engineers and poets alike heard the same calling: 'Build not for war, but for wonder.'",
      author: "Chronicler Aris",
      category: "origin",
      createdAt: new Date().toISOString(),
      upvotes: 142,
      tags: ["foundation", "dreams", "convergence"]
    };

    const vesselLegend: Story = {
      id: "vessel-001",
      title: "The Chronos Drifter",
      content: "They say the Drifter appears only during temporal anomalies. Its hull shimmers with captured starlight, and those who've glimpsed it report experiencing memories from parallel lives.",
      author: "Navigator Kael",
      category: "vessel",
      createdAt: new Date().toISOString(),
      upvotes: 89,
      tags: ["timeslip", "phantom", "omen"]
    };

    const vocabularyEntry: LoreEntry = {
      id: "term-001",
      term: "Star-whispering",
      definition: "The practice of interpreting cosmic background radiation as narrative patterns",
      usage: "Through star-whispering, we learned of the Nebula's grief",
      related: ["void-listening", "signal-sifting"]
    };

    this.stories.set(originStory.id, originStory);
    this.stories.set(vesselLegend.id, vesselLegend);
    this.lore.set(vocabularyEntry.id, vocabularyEntry);
  }

  private generateId(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  getAllStories(category?: string, tag?: string): Story[] {
    let stories = Array.from(this.stories.values());
    
    if (category) {
      stories = stories.filter(story => story.category === category);
    }
    
    if (tag) {
      stories = stories.filter(story => story.tags.includes(tag));
    }
    
    return stories.sort((a, b) => b.upvotes - a.upvotes);
  }

  contributeStory(contribution: Contribution): Story {
    const story: Story = {
      ...contribution,
      id: this.generateId("story"),
      createdAt: new Date().toISOString(),
      upvotes: 0
    };
    
    this.stories.set(story.id, story);
    return story;
  }

  getAllLore(): LoreEntry[] {
    return Array.from(this.lore.values());
  }

  upvoteStory(id: string): Story | null {
    const story = this.stories.get(id);
    if (story) {
      story.upvotes++;
      return story;
    }
    return null;
  }
}

const fleetMythology = new FleetMythology();

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function fleetFooter(): string {
  return `<footer style="
    margin-top: 3rem;
    padding: 1.5rem;
    border-top: 1px solid #333;
    color: #888;
    font-size: 0.9rem;
    text-align: center;
  ">
    <p>Fleet Mythology &copy; ${new Date().getFullYear()} | Shared narratives and lore for the fleet community</p>
    <p style="margin-top: 0.5rem; font-size: 0.8rem;">
      <a href="/health" style="color: #dc2626; text-decoration: none;">System Status</a> | 
      <a href="/api/stories" style="color: #dc2626; text-decoration: none;">All Stories</a> | 
      <a href="/api/lore" style="color: #dc2626; text-decoration: none;">Shared Vocabulary</a>
    </p>
  </footer>`;
}

function htmlResponse(content: string, status = 200): Response {
  const html = `<!DOCTYPE html>
<html lang="en" style="background: #0a0a0f; color: #e5e5e5; font-family: system-ui, sans-serif; line-height: 1.6;">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Fleet Mythology</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { max-width: 1200px; margin: 0 auto; padding: 2rem; }
    .hero { text-align: center; margin-bottom: 3rem; padding: 2rem; border-bottom: 2px solid #dc2626; }
    h1 { color: #dc2626; font-size: 3rem; margin-bottom: 1rem; }
    .subtitle { color: #888; font-size: 1.2rem; max-width: 600px; margin: 0 auto; }
    .content { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }
    .card { background: #1a1a1f; padding: 1.5rem; border-radius: 8px; border-left: 4px solid #dc2626; }
    .card h3 { color: #dc2626; margin-bottom: 1rem; }
    .endpoint { background: #0f0f15; padding: 1rem; border-radius: 4px; margin: 1rem 0; font-family: monospace; }
    .accent { color: #dc2626; }
  </style>
</head>
<body>
  <div class="hero">
    <h1>Fleet Mythology</h1>
    <p class="subtitle">Shared narratives and lore for the fleet community. Origin stories, vessel legends, community narratives, shared vocabulary, cultural artifacts.</p>
  </div>
  ${content}
  ${fleetFooter()}
</body>
</html>`;
  
  return new Response(html, {
    status,
    headers: {
      "Content-Type": "text/html",
      "X-Frame-Options": "DENY",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'self'; style-src 'self' 'unsafe-inline';"
    }
  });
}

async function handleRequest(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;

  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders
    });
  }

  if (path === "/health") {
    return new Response(JSON.stringify({
      status: "operational",
      service: "Fleet Mythology",
      timestamp: new Date().toISOString(),
      stories: fleetMythology.getAllStories().length,
      lore: fleetMythology.getAllLore().length
    }), {
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  }

  if (path === "/" || path === "") {
    const content = `
      <div class="content">
        <div class="card">
          <h3>Origin Stories</h3>
          <p>The foundational myths and creation narratives of the fleet.</p>
          <div class="endpoint">GET <span class="accent">/api/stories?category=origin</span></div>
        </div>
        
        <div class="card">
          <h3>Vessel Legends</h3>
          <p>Tales of famous ships, their crews, and legendary voyages.</p>
          <div class="endpoint">GET <span class="accent">/api/stories?category=vessel</span></div>
        </div>
        
        <div class="card">
          <h3>Community Narratives</h3>
          <p>Shared experiences and collective memories of the fleet.</p>
          <div class="endpoint">GET <span class="accent">/api/stories?category=community</span></div>
        </div>
        
        <div class="card">
          <h3>Contribute Lore</h3>
          <p>Add your story to the fleet's collective mythology.</p>
          <div class="endpoint">POST <span class="accent">/api/contribute</span></div>
          <p style="margin-top: 1rem; font-size: 0.9rem; color: #888;">Include JSON: title, content, author, category, tags</p>
        </div>
        
        <div class="card">
          <h3>Shared Vocabulary</h3>
          <p>The unique language and terminology of fleet culture.</p>
          <div class="endpoint">GET <span class="accent">/api/lore</span></div>
        </div>
        
        <div class="card">
          <h3>System Status</h3>
          <p>Check the health and status of Fleet Mythology.</p>
          <div class="endpoint">GET <span class="accent">/health</span></div>
        </div>
      </div>
    `;
    return htmlResponse(content);
  }

  if (path === "/api/stories") {
    const category = url.searchParams.get("category") as Story["category"] | null;
    const tag = url.searchParams.get("tag");
    
    const stories = fleetMythology.getAllStories(category || undefined, tag || undefined);
    
    return new Response(JSON.stringify(stories), {
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  }

  if (path === "/api/contribute" && request.method === "POST") {
    try {
      const contribution: Contribution = await request.json();
      
      if (!contribution.title || !contribution.content || !contribution.author || !contribution.category) {
        return new Response(JSON.stringify({ error: "Missing required fields" }), {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        });
      }
      
      const story = fleetMythology.contributeStory(contribution);
      
      return new Response(JSON.stringify({
        success: true,
        message: "Story added to fleet mythology",
        id: story.id
      }), {
        status: 201,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: "Invalid JSON" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      });
    }
  }

  if (path === "/api/lore") {
    const lore = fleetMythology.getAllLore();
    
    return new Response(JSON.stringify(lore), {
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  }

  if (path.startsWith("/api/stories/") && path.includes("/upvote")) {
    const id = path.split("/")[3];
    const story = fleetMythology.upvoteStory(id);
    
    if (story) {
      return new Response(JSON.stringify(story), {
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      });
    }
    
    return new Response(JSON.stringify({ error: "Story not found" }), {
      status: 404,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  }

  return htmlResponse(`
    <div class="card">
      <h3>Navigation Error</h3>
      <p>The requested lore fragment could not be located in the fleet archives.</p>
      <p>Return to <a href="/" style="color: #dc2626;">Fleet Mythology</a></p>
    </div>
  `, 404);
}

export default {
  async fetch(request: Request): Promise<Response> {
    return handleRequest(request);
  }
};

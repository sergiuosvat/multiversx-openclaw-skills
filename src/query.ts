import axios from 'axios';

/**
 * Interface for the MCP Query Skill
 */
interface QueryParams {
    endpoint: string;
    params?: Record<string, any>;
    mcpUrl?: string; // Optional override, defaults to env
}

/**
 * Fetches data from the Shared MCP Server or related endpoints.
 * 
 * @param input QueryParams
 * @returns JSON response from the MCP server
 */
export async function query(input: QueryParams): Promise<any> {
    const baseUrl = input.mcpUrl || process.env.MULTIVERSX_MCP_URL || 'http://localhost:3000';
    const url = `${baseUrl}${input.endpoint.startsWith('/') ? '' : '/'}${input.endpoint}`;

    try {
        console.log(`[MultiversX:Query] Fetching ${url}...`);
        const response = await axios.get(url, {
            params: input.params,
            timeout: 5000
        });
        return response.data;
    } catch (error: any) {
        console.error(`[MultiversX:Query] Error fetching ${url}:`, error.message);
        if (error.response) {
            throw new Error(`MCP Query Failed: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
        }
        throw error;
    }
}

import axios from 'axios';
import { query } from '../src/query';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('MultiversX Query Skill', () => {
    it('should fetch data from the MCP endpoint', async () => {
        mockedAxios.get.mockResolvedValue({ data: { score: 95 } });

        const result = await query({
            endpoint: '/agents/1/reputation',
            mcpUrl: 'http://test-mcp'
        });

        expect(mockedAxios.get).toHaveBeenCalledWith('http://test-mcp/agents/1/reputation', expect.any(Object));
        expect(result).toEqual({ score: 95 });
    });

    it('should handle errors gracefully', async () => {
        mockedAxios.get.mockRejectedValue({ response: { status: 404, data: { error: "Not Found" } } });

        await expect(query({ endpoint: '/bad' }))
            .rejects
            .toThrow('MCP Query Failed: 404');
    });
});

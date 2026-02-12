/**
 * Tests for OASF Taxonomy module
 */
import {
    OASF_SCHEMA_VERSION,
    OASF_SKILLS,
    OASF_DOMAINS,
    getSkillCategory,
    getDomainCategory,
    getAllSkillIds,
    getAllDomainIds,
    validateOASF,
} from '../src/oasf_taxonomy';

describe('OASF Taxonomy', () => {
    describe('Schema Version', () => {
        it('should be 0.8.0', () => {
            expect(OASF_SCHEMA_VERSION).toBe('0.8.0');
        });
    });

    describe('Skills', () => {
        it('should have 12 skill categories', () => {
            expect(OASF_SKILLS).toHaveLength(12);
        });

        it('should have 136+ total skill items', () => {
            const allSkills = getAllSkillIds();
            expect(allSkills.length).toBeGreaterThanOrEqual(136);
        });

        it('should include Blockchain Operations category', () => {
            const blockchain = OASF_SKILLS.find(
                (g) => g.category === 'Blockchain Operations',
            );
            expect(blockchain).toBeDefined();
            expect(blockchain!.items).toContain('transaction_signing');
            expect(blockchain!.items).toContain('smart_contract_interaction');
            expect(blockchain!.items).toContain('token_transfer');
        });

        it('should find category for a known skill', () => {
            expect(getSkillCategory('transaction_signing')).toBe('Blockchain Operations');
            expect(getSkillCategory('text_generation')).toBe('Natural Language Processing');
            expect(getSkillCategory('delegation')).toBe('Multi-Agent');
        });

        it('should return undefined for unknown skill', () => {
            expect(getSkillCategory('nonexistent_skill')).toBeUndefined();
        });
    });

    describe('Domains', () => {
        it('should have 16 domain categories', () => {
            expect(OASF_DOMAINS).toHaveLength(16);
        });

        it('should have 204+ total domain items', () => {
            const allDomains = getAllDomainIds();
            expect(allDomains.length).toBeGreaterThanOrEqual(204);
        });

        it('should include Finance & Business category', () => {
            const finance = OASF_DOMAINS.find(
                (g) => g.category === 'Finance & Business',
            );
            expect(finance).toBeDefined();
            expect(finance!.items).toContain('trading');
            expect(finance!.items).toContain('defi');
        });

        it('should find category for a known domain', () => {
            expect(getDomainCategory('trading')).toBe('Finance & Business');
            expect(getDomainCategory('diagnostics')).toBe('Healthcare');
            expect(getDomainCategory('threat_detection')).toBe('Cybersecurity');
        });

        it('should return undefined for unknown domain', () => {
            expect(getDomainCategory('nonexistent_domain')).toBeUndefined();
        });
    });

    describe('Validation', () => {
        it('should pass validation for valid OASF manifest', () => {
            const errors = validateOASF({
                schemaVersion: '0.8.0',
                skills: [
                    { category: 'Blockchain Operations', items: ['transaction_signing'] },
                ],
                domains: [
                    { category: 'Finance & Business', items: ['defi'] },
                ],
            });
            expect(errors).toHaveLength(0);
        });

        it('should fail validation for unknown skill', () => {
            const errors = validateOASF({
                schemaVersion: '0.8.0',
                skills: [
                    { category: 'Blockchain Operations', items: ['fake_skill'] },
                ],
                domains: [],
            });
            expect(errors).toHaveLength(1);
            expect(errors[0]).toContain('fake_skill');
        });

        it('should fail validation for unknown domain', () => {
            const errors = validateOASF({
                schemaVersion: '0.8.0',
                skills: [],
                domains: [
                    { category: 'Finance & Business', items: ['fake_domain'] },
                ],
            });
            expect(errors).toHaveLength(1);
            expect(errors[0]).toContain('fake_domain');
        });

        it('should report multiple errors', () => {
            const errors = validateOASF({
                schemaVersion: '0.8.0',
                skills: [
                    { category: 'X', items: ['bad1', 'bad2'] },
                ],
                domains: [
                    { category: 'Y', items: ['bad3'] },
                ],
            });
            expect(errors).toHaveLength(3);
        });
    });
});

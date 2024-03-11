import { fetchSource } from './fetchSource';

const mockResp = jest.fn().mockResolvedValue({ flights: [] });
const mockFetch = jest.fn().mockResolvedValue({
  ok: true,
  json: () => mockResp(),
} as Response);

jest.spyOn(global, 'fetch').mockImplementation(() => mockFetch());

describe('fetchSource', () => {
  it('should fetch data', async () => {
    const data = await fetchSource('http://foo.bar');
    expect(data).toEqual({ flights: [] });
  });

  it('should fail id not ok', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 1337,
      statusText: 'Yo dawg!',
    });
    await expect(
      fetchSource('http://foo.bar'),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"1337 Yo dawg! http://foo.bar"`,
    );
  });

  it('should fail if not valid JSON', async () => {
    mockResp.mockResolvedValue({ abc: 123 });
    await expect(
      fetchSource('http://foo.bar'),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Invalid JSON from http://foo.bar"`,
    );
  });
});

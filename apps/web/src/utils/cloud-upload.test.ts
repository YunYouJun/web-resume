import { afterEach, describe, expect, it, vi } from 'vitest'
import { sha256Hex, uploadYaml } from '~/stores/cloud'

afterEach(() => vi.unstubAllGlobals())

describe('cloud resume upload', () => {
  it('hashes portable YAML bytes before reserving storage', async () => {
    await expect(sha256Hex(new TextEncoder().encode('name: Yun\n'))).resolves.toBe('783abb93b8e20b830d851ff3861bd30ee5b53e405e97cf7dda32bb1e51df1b53')
  })

  it('uploads only to a signed Shanghai COS capability without credentials', async () => {
    const fetchMock = vi.fn(async (_input: RequestInfo | URL, _init?: RequestInit) => new Response(null, { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)
    await uploadYaml({
      headers: { 'Content-Type': 'application/yaml' },
      method: 'PUT',
      url: 'https://yunlefun-private-1325586649.cos.ap-shanghai.myqcloud.com/object?q-signature=signed&x-cos-security-token=temporary',
    }, new TextEncoder().encode('name: Yun\n'))

    expect(fetchMock).toHaveBeenCalledOnce()
    expect(fetchMock.mock.calls[0]?.[1]).toMatchObject({ credentials: 'omit', method: 'PUT' })
  })

  it('rejects foreign upload hosts and extra signed headers', async () => {
    await expect(uploadYaml({
      method: 'PUT',
      url: 'https://attacker.example/object?q-signature=signed&x-cos-security-token=temporary',
    }, new Uint8Array([1]))).rejects.toThrow(/invalid/)
    await expect(uploadYaml({
      method: 'PUT',
      url: 'https://attacker-bucket.cos.ap-shanghai.myqcloud.com/object?q-signature=signed&x-cos-security-token=temporary',
    }, new Uint8Array([1]))).rejects.toThrow(/invalid/)
    await expect(uploadYaml({
      headers: { Authorization: 'secret' },
      method: 'PUT',
      url: 'https://yunlefun-private-1325586649.cos.ap-shanghai.myqcloud.com/object?q-signature=signed&x-cos-security-token=temporary',
    }, new Uint8Array([1]))).rejects.toThrow(/unsupported header/)
  })
})

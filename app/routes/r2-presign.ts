export { action } from './api.r2-presign'

export async function loader() {
	return Response.json(
		{
			error: 'Method not allowed',
			message: 'Use POST /api/r2-presign with JSON body: { filename, contentType, tool? }',
		},
		{ status: 405 },
	)
}

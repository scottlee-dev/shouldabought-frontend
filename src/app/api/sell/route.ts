export async function POST(request: Request) {
  const body = await request.json();

  const response = await fetch(
    "http://localhost:8080/api/accounts/1/sell",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  const data = await response.json();

  return Response.json(data, {
    status: response.status,
  });
}
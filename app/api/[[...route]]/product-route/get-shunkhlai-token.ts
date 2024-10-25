export default async function getShunkhlaiToken() {
  try {
    const response = await fetch(
      "http://testsvr.shunkhlai.mn:8073/api/auth/get_tokens?username=b2c_user&password=$%23Erw45d"
    );

    if (!response.ok) {
      throw new Error("Failed to fetch tokens");
    }

    const data = await response.json();
    //Shunkhlai access_token
    const token = data.access_token;
    return token;
  } catch (error) {
    console.error("Error fetching token", error);
    return new Response(JSON.stringify({ error: "Failed to fetch token" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

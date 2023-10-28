export async function getResource() {
  try {
    const response = await fetch("https://marcconrad.com/uob/tomato/api.php");
    const jsonResponse = await response.json();
    return jsonResponse;
  } catch (e) {
    console.log(e);
  }
}

function App() {
  return (
    <>
      <form method="POST" action="http://localhost:8000/get-product">
        <label>
          Enter ASIN Number:
          <br />
          <input type="text" name="asin" />
        </label>
        <br />
        <input type="submit" value="Scrape Product" />
      </form>
    </>
  );
}

export default App;

const fs = require('fs');
const html = fs.readFileSync('sansad_test.html', 'utf8');

const startTag = '<script id="__NEXT_DATA__" type="application/json">';
const startIndex = html.indexOf(startTag);
if (startIndex !== -1) {
  const contentStart = startIndex + startTag.length;
  const contentEnd = html.indexOf('</script>', contentStart);
  const jsonString = html.substring(contentStart, contentEnd);
  try {
    const data = JSON.parse(jsonString);
    console.log(Object.keys(data));
    console.log(Object.keys(data.props));
    console.log(Object.keys(data.props.pageProps));
    console.log(data.props.pageProps.initialState);
  } catch (e) {
    console.error("Parse error:", e.message);
  }
} else {
  console.log("No NEXT_DATA found");
}

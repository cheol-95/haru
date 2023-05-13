const makeAlert = (message) => {
  return `<script> alert("${message}");
  location.href="${process.env.DOMAIN}"
  </script>`;
};

module.exports = {
  makeAlert,
};

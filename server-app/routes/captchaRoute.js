// const express = require("express");
// const svgCaptcha = require("svg-captcha");

// const router = express.Router();

// // Generate a new CAPTCHA
// router.get("/captcha", (req, res) => {
//   const captcha = svgCaptcha.create({
//     size: 6,
//     noise: 3,
//     color: true,
//     ignoreChars: "0o1i",
//   });

//   req.session.captcha = captcha.text;
//   res.type("svg");
//   res.status(200).send(captcha.data);
// });

// // Validate the CAPTCHA
// router.post("/verify-captcha", (req, res) => {
//   const { captcha } = req.body;
//   if (req.session.captcha && req.session.captcha === captcha) {
//     res.json({ success: true, message: "CAPTCHA matched!" });
//   } else {
//     res.json({ success: false, message: "CAPTCHA verification failed!" });
//   }
// });

// module.exports = router;

const express = require("express");
const svgCaptcha = require("svg-captcha");

const router = express.Router();

// ✅ Generate a new CAPTCHA and store in session
router.get("/captcha", (req, res) => {
  console.log("Session ID:", req.sessionID);
  console.log("Session Data Before CAPTCHA:", req.session);
  const captcha = svgCaptcha.create({
    size: 6,
    noise: 3,
    color: true,
    ignoreChars: "0o1il",
  });

  req.session.captcha = captcha.text; // ✅ Store in session
  console.log("Generated CAPTCHA:", req.session.captcha); // ✅ Debugging

  res.type("svg");
  res.status(200).send(captcha.data);
});
// ✅ Validate the CAPTCHA (NO CSRF REQUIRED)
router.post("/verify-captcha", (req, res) => {
  const { captcha } = req.body;
  console.log("Received CAPTCHA:", captcha); // ✅ Debugging
  console.log("Stored CAPTCHA:", req.session.captcha); // ✅ Debugging

  if (!req.session.captcha) {
    return res
      .status(400)
      .json({ success: false, message: "Session expired. Refresh CAPTCHA." });
  }

  if (req.session.captcha === captcha) {
    return res.json({ success: true, message: "CAPTCHA matched!" });
  } else {
    return res
      .status(400)
      .json({ success: false, message: "CAPTCHA verification failed!" });
  }
});

module.exports = router;

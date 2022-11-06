// 휴대폰 인증 토큰 전송하기
const getValidationNumber = async () => {
  document.querySelector("#ValidationInputWrapper").style.display = "flex";
  console.log("인증 번호 전송");
  const myPhone1 = document.getElementById("PhoneNumber01").value;
  const myPhone2 = document.getElementById("PhoneNumber02").value;
  const myPhone3 = document.getElementById("PhoneNumber03").value;
  const myPhone = myPhone1 + myPhone2 + myPhone3;
  await axios
    .post("http://localhost:3000/tokens/phone", {
      myPhone: myPhone,
    })
    .then((res) => {
      return res;
    });
};

// 핸드폰 인증 완료 API 요청
const submitToken = async () => {
  console.log("핸드폰 인증 완료");
  const myPhone1 = document.getElementById("PhoneNumber01").value;
  const myPhone2 = document.getElementById("PhoneNumber02").value;
  const myPhone3 = document.getElementById("PhoneNumber03").value;
  const myPhone = myPhone1 + myPhone2 + myPhone3;
  const myToken = document.getElementById("TokenInput").value;

  await axios
    .patch("http://localhost:3000/tokens/phone", {
      myPhone: myPhone,
      myToken: myToken,
    })
    .then((res) => {
      return res;
    });
};

// 회원 가입 API 요청
const submitSignup = async () => {
  console.log("회원 가입 완료");
  const myPhone1 = document.getElementById("PhoneNumber01").value;
  const myPhone2 = document.getElementById("PhoneNumber02").value;
  const myPhone3 = document.getElementById("PhoneNumber03").value;
  const myPhone = myPhone1 + myPhone2 + myPhone3;

  const regiNum1 = document.getElementById("SignupPersonal1").value;
  const regiNum2 = document.getElementById("SignupPersonal2").value;
  const reg = `${regiNum1}-${regiNum2}`;

  const data = {
    name: document.getElementById("SignupName").value,
    personal: reg,
    prefer: document.getElementById("SignupPrefer").value,
    email: document.getElementById("SignupEmail").value,
    pwd: document.getElementById("SignupPwd").value,
    phone: myPhone,
  };

  await axios.post("http://localhost:3000/user", data).then((res) => {
    // console.log(res);
    console.log(res.data);
    return res.data;
  });
};

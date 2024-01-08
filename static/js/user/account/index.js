$(document).ready(function(){
  $("#frmRegister").on("submit",function(e){
    e.preventDefault();
    var username = $("#txtUsername").val();
    var password = $("#txtPassword").val();
    var conpassword = $("#txtConfirm").val();
    var email = $("#txtEmail").val();
    let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?!.*\s).{8,50}$/;
    var pattern = /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i;
    var flag = true;
    console.log(password);
    console.log(conpassword);
    if (username.length === 0 || username === null) {
      alert('Please input username.');
      return;
    }
    if(!regex.test(password)){
      alert('Invalid password. Password must contain at least 8 characters, cannot exceed 50 character, including UPPER/lowercase and numbers');
      return;
    }
    if(password !== conpassword){
      alert('Password and confirm password do not match.');
      return;
    }
    if(!pattern.test(email)){
      alert('Invalid email address.');
      return;
    }
    $.getJSON(`/account/is-available-user`,{username:username}, function (data) {
      console.log(data);
      if (data === false) {
        alert('Username is already taken.');
        flag = false;
      }
      else{
        $.getJSON(`/account/is-available-email`,{email:email}, function (data) {
          console.log(data);
          if (data === false) {
            alert('Email is already taken.');
            flag = false;
          }
          else{
            $('#frmRegister').unbind('submit').submit();
          }
        });
      }
    });
  })
});



$('#fuMain').fileinput({
    showPreview: false,
    dropZoneEnabled: false,
    maxFileCount: 1,
    allowedFileExtensions: ['jpg', 'png', 'gif'],
    language: 'vi',
});

async function uploadAvatar() {
    const fileInput = $("#fuMain")[0].files[0];
    if (!fileInput) {
      console.error('No file selected.');
      return;
    }
  
    const formData = new FormData();
    formData.append('image', fileInput);
  
    return new Promise((resolve, reject) => {
      $.ajax({
        url: '/merchant/upload-avatar',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function(data) {
            console.log(data);
            resolve(data);
        },
        error: function(error) {
            console.error('Error:', error);
            reject(error);
        }
      });
    });
  }
  
  $("#updateButton").on("click", async function(event) {
    event.preventDefault();
    try {
      await uploadAvatar();
      $("#imageForm").submit();
      alert("Đã cập nhật thông tin thành công!!!");
      //window.location.reload(true);
      $.ajax({
        success: function(html){
            location.reload();
        }
        });
    } catch (error) {
      console.error('Error during avatar upload:', error);
    }
  });
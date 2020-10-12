$(function () {
  $("#delete-btn").click((e) => {
    const el = $(e.target);
    const id = el.attr("data-id");
    const cf = confirm("是否要删除？");
    if (cf === true) {
      $.ajax({
        type: "DELETE",
        url: "/delete/" + id,
        success: function (res) {
          alert("Delete success");
          window.location.href = "/";
        },
        error: function (err) {
          console.log(err);
        },
      });
    } else {
      //
    }
  });
});

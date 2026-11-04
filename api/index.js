var page_num=1;
$(document).ready(function(){
  fetchAllProduct(page_num);
});

function fetchAllProduct(page) {
  $.ajax({
    type:"GET",
    url:"https://api.escuelajs.co/api/v1/products?limit=16&offset="+page,
    beforeSend:function(){
      $("#container_loader").css({display:"block"});
    },
    success:function(res){
      $("#container_loader").css({display:"none"});

      // console.log(res);
      var box=document.getElementById("container");
          box.innerHTML="";
      for(i=0;i<res.length;i++){
        var data=res[i];
        var id=data.id;
        var title=data.title;
        var dec=data.description;
        var price=data.price;
        var link=data.images[0];
var catname=data.category.name;
        var desing=`<div id="productBox">
<img src="${link}" style="width:100%;height:140px;"/>
<h2>${title}</h2>
<P>price${price}</p>
<P>${dec}</p>
<P>${catname}</p>
<div id="action_box">
<i class="fa fa-edit" onclick="editProduct(${id})"></i>
<i class="fa fa-trash" onclick="deleteProduct(${id})"></i>
</div>
</div>`;
box.innerHTML+=desing;
      }

    },
    error:function(err) {
    $("#container_loader").css({display:"block"});
      console.log(err);
      alert("no data found");
    }
  })
}

$(document).ready(function(){
  $("#next_btn").click(function(){
    page_num=page_num+1;
      fetchAllProduct(page_num);
  });

  $("#prev_btn").click(function(){
    if(page_num>1) {
      page_num=page_num-1;
        fetchAllProduct(page_num);
    }

  });
})

$(document).ready(function(){
  $("#btn").click(function(){
    $("#dialog").dialog();
  });
  $("#product_form").submit(function(e){
    e.preventDefault();
    var title=$("#title").val();
      var price=$("#price").val();
        var description=$("#dsec").val();
        var link=$("#image_link").val();
            var cat=$("#category").val();
        $.ajax({
          type:"POST",
          url:"https://api.escuelajs.co/api/v1/products",
          data:{
            "title":title,
            "price":price,
            "description":description,
            "categoryId":cat,
            "images":[link]
          },
          beforeSend:function(){
            $("#submit_btn").html("processing");
                $("#submit_btn").attr("disabled","disabled");
          },
          success:function(res) {
            window.alert("product created");
            $("#submit_btn").html("Submit");
                $("#submit_btn").removeAttr("disabled");

          },error:function(err){
            $("#submit_btn").html("Submit");
        $("#submit_btn").removeAttr("disabled");
            if(err.status==429) {
              window.alert("somwthing went wrong try again");
            }
            console.log(err);

          }

        })
  });

});

$(document).ready(function(){
  fetchAllCategories();
});

function fetchAllCategories() {
  $.ajax({
    type:"GET",
    url:"https://api.escuelajs.co/api/v1/categories?limit=0",
    success:function(res){
      // console.log(res);
      $(res).map(function(index,item){
        var id=item.id;
        var name=item.name;
        var option=document.createElement("OPTION");
        option.value=id;
        option.innerHTML=name;
        $("#category").append(option);

        var edit_option=document.createElement("OPTION");
        edit_option.value=id;
        edit_option.innerHTML=name;

      $("#edit_category").append(edit_option);
      })

    },error:function(err){
console.log(err)
    }
  })
}


function deleteProduct(id) {
  // alert(id);
  $.ajax({
    type:"DELETE",
    url:"https://api.escuelajs.co/api/v1/products/"+id,
    success:function(res) {
      alert("delete success");
      window.location=location.href;
  }, error:function (err) {
    console.log(err);
  }

  })

}


function editProduct(id){
  // alert(id);
  $.ajax({
    type:"GET",
    url:"https://api.escuelajs.co/api/v1/products/"+id,
    success:function(res) {
      $("#edit_btn").attr("productid",id);
      $("#edit_model").css({display:"block"});
      var title=res.title;
// var title=res.title;
var price=res.price;
    var desc=res.description;
        var image=res.images[0];
            var catid=res.category.id;
    $('#edit_title').val(title);
    $('#edit_price').val(price);
  $('#edit_desc').val(desc);
    $('#edit_Image').val(image);
  $('#edit_category').val(catid).map(function(index,item){
    if(item.value==catid) {
      $(item).attr("selected","selected");
    } else {
      $(item).removeAttr("select");
    }
  })
    }
  })
}

$(document).ready(function(){
  $("#edit_from").submit(function(e){
    e.preventDefault();
    var link=$("#edit_Image").val();
var id=$("#edit_btn").attr("productid");
$.ajax({
  type:"PUT",
  url:"https://api.escuelajs.co/api/v1/products/"+id,
  beforeSend:function() {
    $("#edit_btn").html("processing....");
    $("#edit_btn").attr("disabled","disabled");
  },
  data:{
    "title":$("#edit_title").val(),
  "price":$("#edit_price").val(),
  "description":$("#edit_desc").val(),
  "categoryId":$("#edit_category").val(),
  "images": [
link
  ]
},success:function(res){
  $("#edit_btn").html("save change");
  $("#edit_btn").removeAttr("disabled");
  fetchAllProduct(page_num);
      $("#edit_model").css({display:"none"});
      window.alert("update successFull🥰");
},
error:function(){
  $("#edit_btn").html("save change");
  $("#edit_btn").removeAttr("disabled");
    $("#edit_model").css({display:"none"});
    window.alert("update failled");
}
})
  })
});

$(document).ready(function(){
  $("#close_btn").click(function(){
        $("#edit_model").css({display:"none"});
  });
});

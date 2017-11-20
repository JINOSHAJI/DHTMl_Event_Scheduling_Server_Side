var cData,iData,bData,tcData;
var statusC=0,statusI=0,statusB=0,statusTC=0;
var iid;    
var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};
function initial() {
    $('#invoiceDate').datepicker({dateFormat: 'yy-mm-dd'});
    $('#dueDate').datepicker({dateFormat: 'yy-mm-dd'});
  

   iid =getUrlParameter("iid");    

    fillCustomer();
    fillItem();
    fillBatch();
    fillTableContents();
}

function fillCustomer() {
    $.ajax({
        url: 'stCustomer',
        type: 'GET',
        data: {type: 'getCustomerDetails'},
        success: function (data, textStatus, jqXHR) {
            
            if (data[0].status == "0") {
                alert("Error");
                //console.log(data[0].errorMessage);

                return;
            }
            //console.log(data);

            data.shift();
            cData = data;

            $.each(data, function (i, dat) {
              //  console.log(dat);
                $('#selectCustomer').append($('<option>', {
                    value: dat.customerId,
                    text: dat.customerName
                }));
            });
            $("#selectCustomer").chosen();
            //loadCust();
            statusC=1;
            checkStatus();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Error");
            $("#loading").hide();
            console.log(textStatus + " " + errorThrown);
        }
    });
}

function fillItem() {
    $.ajax({
        url: 'stGetBasics',
        type: 'GET',
        data: {type: 'allItem'},
        success: function (data, textStatus, jqXHR) {
            
            if (data[0].status == "0") {
                alert("Error");
                //console.log(data[0].errorMessage);

                return;
            }
            console.log(data);

            data.shift();
            iData = data;
            //var id='1';
            loadItem();
            
           
            statusI=1;
            checkStatus();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Error");
            $("#loading").hide();
            console.log(textStatus + " " + errorThrown);
        }
    });
}

function fillBatch() {
    $.ajax({
        url: 'stGetBasics',
        type: 'GET',
        data: {type: 'allBatch'},
        success: function (data, textStatus, jqXHR) {
            
            if (data[0].status == "0") {
                alert("Error");
                //console.log(data[0].errorMessage);

                return;
            }
            //console.log("batch");
           console.log(data);

            data.shift();
            bData = data;
           // var id='1';
            //loadBatch(id);
            //$("#batchName1").chosen();
           
            statusB=1;
            checkStatus();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Error");
            $("#loading").hide();
            console.log(textStatus + " " + errorThrown);
        }
    });
}

function fillTableContents(){

    $.ajax({
        url: 'stGetBasics',
        type: 'GET',
        data: {type: 'editPurchase',iid:iid},
        success: function (data, textStatus, jqXHR) {
            
            if (data[0].status == "0") {
                alert("Error");
                //console.log(data[0].errorMessage);

                return;
            }
            //console.log("batch");
           console.log(data);

            data.shift();
            tcData = data;
            statusTC=1;
            checkStatus();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Error");
            $("#loading").hide();
            console.log(textStatus + " " + errorThrown);
        }
    });
}
function loadItem(){
    $('#itemName').append($('<option>', {
                    value: "",
                    text: "Select"
                }));
                
                $('#itemCode').append($('<option>', {
                    value: "",
                    text: "Select"
                }));
            $.each(iData, function (i, dat) {
              //  console.log(dat);
                $('#itemName').append($('<option>', {
                    value: dat.itemCode,
                    text: dat.itemName
                }));
                
                $('#itemCode').append($('<option>', {
                    value: dat.itemCode,
                    text: dat.itemCode
                }));
            });
            $("#itemName").chosen();
            $("#itemCode").chosen();
    
}

function loadBatch(itemId){
    $("#batchName").empty();
    var f=false;
            $.each(bData, function (i, dat) {
//                console.log(itemId+" "+dat.itemId);
              if(dat.itemId==itemId){
                  f=true;
                $('#batchName').append($('<option>', {
                    value: dat.batchId,
                    text: dat.batchName
                }));
            }
            else if (f==true) {
                return false;
            }
            });
           $("#batchName").chosen();
            $("#batchName").trigger("chosen:updated");
    changeBatch();
}


function changeBatch(){
    var batchId=$("#batchName").val();
    var batch;
    $.each(bData, function (i, dat) {
              //  console.log(batchId+" "+dat.batchId);
              if(dat.batchId==batchId){
              batch=dat;
              return false;
         }
          });
          $("#rpi").text(Number(batch.pp).toFixed(2));
    var type;
    $.each(iData, function (i, dat) {
              //  console.log(batchId+" "+dat.batchId);
              if(dat.itemId==batch.itemId){
              type=dat.itemType;
              return false;
         }
          });
          
}

function checkStatus(){
    var ch=Number(statusB)+Number(statusC)+Number(statusI)+Number(statusTC);
    if(ch==4){
        $("#loading").hide();console.log(tcData);
    $("#dueDate").val(tcData[0].dueDate);
    $("#invoiceDate").val(tcData[0].invoiceDate);
    $("#notes").val(tcData[0].notes);
    $("#selectCustomer").val(tcData[0].customer);
    $("#purchaseInvoice").val(tcData[0].invoiceNumber);
    $("#selectReverse").val(tcData[0].reverseCharge);
    $("#selectCustomer").trigger("chosen:updated");
    tcData.shift();
    $.each(tcData,function (i,dat){
      var batchId=dat.batchId;
      var batch,item;
             $.each(bData,function (i,bdat){
                 if(bdat.batchId==batchId){
                     batch=bdat;
                    // bData[i].stock=Number(bData[i].stock)+Number(dat.qty);
                     //console.log(bData);
                     return false;
                 }   
            });
            $.each(iData,function (i,idat){
       
            if(idat.itemId==batch.itemId){
                item=idat;
                return false;
            } 
             });
            console.log(batch);
        addItem(item,batch,dat.qty,dat.discount,dat.advance);         
   });
}
}

function loadCust() {
    var cid = $("#selectCustomer").val();

    $.each(cData, function (i, dat) {
        if (dat.customerId == cid) {
            $("#selectState").val(dat.state);
            var state = $("#selectState option:selected").text();
            $("#billingAddress").val(dat.customerName + "\n" + dat.address + "," + dat.city + "," + state + "\n" + dat.country);
            
            return;
        }
    });
}

function changeItemName(){
   var item;
   var cur=$("#itemName");
   var code=$("#itemCode");
   var itemCode=cur.val();   
   $.each(iData,function (i,dat){
       
      if(dat.itemCode==itemCode){
          item=dat;
          return false;
      } 
   });
   
    code.val(item.itemCode);
    code.trigger("chosen:updated");
    loadBatch(item.itemId);
}


function changeItemCode(id){
   var item;
   var itemName=$("#itemName");//select
   var code=$("#itemCode");//select
   var itemCode=code.val();   
   $.each(iData,function (i,dat){
       
      if(dat.itemCode==itemCode){
          item=dat;
          return false;
      } 
   });
   
    itemName.val(item.itemCode);
    itemName.trigger("chosen:updated");
    loadBatch(item.itemId);
}

function addItem(item,batch,qty,disc,advance){
    var dType=$('input[name=dType]:checked').val();
if(dType=="1"){
    disc=disc;
    }else if(dType=="2"){
        var temp=(Number(batch.pp)*Number(qty));
        disc=(temp/100)*disc;
    }

    var rowCount = $('#tableItem tr').length;
    var tv,total,tax;
    tv=(Number(batch.pp)*Number(qty))-Number(disc);
    tax=Number(item.cgst)+Number(item.sgst)+Number(item.cess);
    total=tv+((tv/100)*tax)-Number(advance);
    total=total.toFixed(2);

var newRow=$("<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td hidden></td><td><a><span class='removeItem glyphicon glyphicon-remove'></span></a></td</tr>")
newRow.children().eq(0).text(rowCount);
newRow.children().eq(1).text(item.itemCode);
newRow.children().eq(2).text(item.itemName);
newRow.children().eq(3).text(batch.batchName);
newRow.children().eq(4).text(qty);
newRow.children().eq(5).text(Number(batch.pp).toFixed(2));
newRow.children().eq(6).text(Number(disc).toFixed(2));
newRow.children().eq(7).text(Number(advance).toFixed(2));
newRow.children().eq(8).text(tv.toFixed(2));

newRow.children().eq(9).text(item.cgst);
newRow.children().eq(10).text(item.sgst);
newRow.children().eq(11).text(item.cess);
newRow.children().eq(12).text(total);
newRow.children().eq(13).text(batch.batchId);
$("#tableItem").append(newRow);
$("#itemCode").val("");
$("#itemName").val("");
$("#batchName").empty();
$("#itemName").trigger("chosen:updated");
$("#itemCode").trigger("chosen:updated");
$("#batchName").trigger("chosen:updated");
$("#qty").val("1");
$("#disc").val("0");
$("#advance").val("0");
$("#rpi").text("-");

    grandTotal();
}

function grandTotal(){
    var total=Number(0);
     $('#tableItem tr').each(function(index) {
         
      var t=  $(this).find('td:nth-child(13)');
      total=total+Number(t.text());
    });
        total=total.toFixed(2);

    $("#grandTotal").val(total);
}

function assignSl(){
     $('#tableItem tr').each(function(index) {
         
      var t=  $(this).find('td:first');
      //console.log(t.text());
      t.text(index);
    });
}

$(function () {

    //$(".chosen-single").chosen();
    $("#selectCustomer").on('change', function () {
        loadCust();
    });

    
$("#addStock").on('click',function (){
    //alert("Decrease Quantity");
    //alert($("#itemCode").val());
    if($("#itemName").val()==""){
        alert("Select Item");
        return;
    }
    var item,batch;
    $.each(iData,function (i,dat){
        if(dat.itemCode==$("#itemCode").val()){
            item=dat;
            return false;
        }
    });
    
       $.each(bData,function (i,dat){
        if(dat.batchId==$("#batchName").val()){
            batch=dat;
            return false;
        }
    });
    //console.log(item.itemName+" "+batch.batchName);
//    if(item.itemType=="1"){
//   if(Number($("#qty").val())>Number($("#stock").text())){
//       alert("Decrease Quantity");
//       return;
//   } 
//    }
    addItem(item,batch,$("#qty").val(),$("#disc").val(),$("#advance").val());
});

$('#tableItem').on('click', '.removeItem', function () {
$(this).closest('tr').remove();
assignSl();
grandTotal();
});

$("#buttonSave").on('click',function(){
    $("#buttonSave").prop('disabled', true);
  var val=validate();  
  if(val==false){
      $("#buttonSave").prop('disabled', false);
      return;
  }
  var invoiceDate=$("#invoiceDate").val();
  var dueDate=$("#dueDate").val();
  var notes=$("#notes").val();
  var customerId=$("#selectCustomer").val();
  var purchaseInvoice=$("#purchaseInvoice").val();
  
  var reverse=$("#selectReverse").val();
  var jsonItem = {
    item: []
};
  $('#tableItem tr').each(function(index) {
         
      var batchId=  $(this).find('td:nth-child(14)').text();
      var qty=$(this).find('td:nth-child(5)').text();
      var discount=$(this).find('td:nth-child(7)').text();
      var advance=$(this).find('td:nth-child(8)').text();
      var obj={"batchId":batchId,"qty":qty,"disc":discount,"advance":advance};
      jsonItem.item.push(obj);
      
  });
   jsonItem.item.shift();
  console.log(jsonItem);
  $.ajax({
            url: "stGetBasics",
            type: 'POST',
            data: {type:"editPurchase",iid:iid,purchaseInvoice:purchaseInvoice,invoiceDate:invoiceDate,notes:notes,dueDate:dueDate,customerId:customerId,reverse:reverse,items:JSON.stringify(jsonItem)},
            success: function (data, textStatus, jqXHR) {
                if (data[0].status == "0") {
                    alert("Error");
                    console.log(data[0].errorMessage);
                    $("#buttonSave").prop('disabled', false);
                    return;
                }
                alert("saved");console.log(data[0]);
                window.location="viewSInvoice.jsp?type=2&sid="+iid;
                $("#buttonSave").prop('disabled', false);
            },
          error: function (jqXHR, textStatus, errorThrown) {
                alert("Error");
                console.log(textStatus + " " + errorThrown);
                $("#buttonSave").prop('disabled', false);
            }
          
             
  });
 //console.log(jsonItem);
});

$("#clear").on('click',function (){
   $("#grandTotal").val("");
   $("#tableItem tbody").empty();
});
});

function validate(){
    if($("#invoiceDate").val().length!=10){
        alert("Enter valid invoice date");
        return false;
    }
    
    if($("#purchaseInvoice").val().trim().length<1){
        alert("Enter Purchase Invoice ID");
        return false;
    }
    if($('#tableItem tr').length==1){
        alert("Add Item");
        return false;
    }
    
    return true;
}
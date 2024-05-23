// document.getElementById("RunUrunBul").addEventListener("click", runClicked);

// function runClicked(){

//     document.getElementById("RunUrunBulBilgi").innerHTML = "Aranıyor...";

//     chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//         chrome.tabs.sendMessage(tabs[0].id, {type:"getText", code:document.getElementById("Runurunkodu").value}, 
//         function(response){
//             if(response>0){
//                 document.getElementById("RunUrunBulBilgi").innerHTML = response + ". sayfada bulundu.<br>" +
//                     "<a target='_blank' style='color:#FE9C0E' href='"+tabs[0].url+"&pg="+response+"'>Buraya</a> tıklayarak sayfaya ulaşabilirsiniz.";
//             }
//             else
//                 document.getElementById("RunUrunBulBilgi").innerHTML = "Ürün bulunamadı.";
//         });
//     });
// }





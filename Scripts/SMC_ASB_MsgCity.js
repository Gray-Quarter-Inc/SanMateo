/*******************************************************
| Script/Function: msgCity()
| Created by: Nicolaj Bunting
| Created on: 18Aug20
| Usage: on submit display message with env var "AddressCity"
| Modified by: ()
*********************************************************/
(function () {
    var theAddrCity = aa.env.getValue("AddressCity");

    showMessage = true;
    comment("The City is : " + theAddrCity);
})();
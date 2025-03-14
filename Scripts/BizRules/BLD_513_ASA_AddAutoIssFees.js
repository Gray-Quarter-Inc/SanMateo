/*******************************************************
| Script/Function: addAutoIssFees(ID513)
| Created by: Nicolaj Bunting
| Created on: 25Sep23
| Usage: On ASA add and invoice fees from schedule "BLD_GEN"
| "BLD_001",
| If parcel field "Fire District" is "County Fire" Then "BLD_153",
| If ASI "PVSystem" is "Yes" Then
| If ASI "Total kW" > 0 Then
| If "Project Type" is "Residential" Then "BLD_017" with quantity $450 + $15 * ASI "Total kW" above 15kW,
| Else If ASI "Project Type" is "Commercial" Then "BLD_128" with quantity $1155 + $8 * ASI "Total kW"
| above 50kW + $6 * kW above 250kW rounded up,
| If ASI "Additional Panels" > 0 Then "BLD_061" with quantity $191 * ASI "Additional Panels",
| If ASI "Solar Panel Type" is "Solar Roof Tiles" And "Total Squares to be Replaced" > 0 Then "BLD_025"
| with quantity $191 If total squares > 10 Then + 116 * ((totalSquares - 10) / 10) rounded up,
|
| Else If ASI "ESSSystem" is "Yes" Then
| If ASI "Number of Energy Systems" > 0 Then "BLD_060" with below conditions:
|   If ASI "Number of Energy Systems" = 1 then the quantity should be 520
|   Otherwise, it should be 520 + 58 * (essNumEnergySys - 1);                    
| If ASI "Additional Subpanels" > 0 Then "BLD_061" with quantity $165 * ASI "Additional Subpanels",
|
| Call ID16 
| Modified by: Hamidreza Alaei - Included the condition for "Number of Energy Systems" being equal to 1
|   GQ 12/27/2024 11008
*********************************************************/
(function () {
    try{
      logDebug("start bld 513 test");
      var invoiceFee = "Y";
      var feeSched = "BLD_GEN";
      var feeResult, feeCode, quantity;
  
      // Application Filing Fee - Easy Review
      feeCode = "BLD_001";
      quantity = 1;
      feeResult = updateFee(feeCode, feeSched, "FINAL", quantity, invoiceFee);
      logDebug("checking fee");
      if (feeResult) {
          Avo_LogDebug("Fee " + feeCode + " has been added with quantity of " + quantity, 1);
      }
      else if (feeResult == null) {
          Avo_LogDebug("Fee " + feeCode + " has been adjusted to a quantity of " + quantity, 1);
      } else {
          Avo_LogDebug("Failed to add fee " + feeCode, 1);
      }
  
      // #region FireDistrict
      // Get fire district
      var allParcelAttrs = new Array();
      loadParcelAttributes(allParcelAttrs, capId);
  
      var fireDist = String(allParcelAttrs["ParcelAttribute." + "Fire District".toUpperCase()]);
      
  Avo_LogDebug("Fire District(" + fireDist + ")", 2); //debug
  
      if (fireDist == "County Fire" || fireDist == "CSA SM Highlands") {
          // Cal-Fire Inspect or Reinspect Fee
          var roofPhotoSys = String(getAppSpecific('PVSystem', capId));
          var enStoreSys = String(getAppSpecific('ESSSystem', capId));
  
          if (roofPhotoSys.toUpperCase() == "YES" && enStoreSys.toUpperCase() != "YES") {
              feeSched = "CFS_GEN_MANUAL";
              feeCode = "CFS_367";
          } else if (roofPhotoSys.toUpperCase() != "YES" && enStoreSys.toUpperCase() == "YES") {
              feeSched = "CFS_GEN_MANUAL";
              feeCode = "CFS_368";
          } else if (roofPhotoSys.toUpperCase() == "YES" && enStoreSys.toUpperCase() == "YES") {
              feeSched = "CFS_GEN_MANUAL";
              feeCode = "CFS_369"
          }
          
          quantity = 1;
          feeResult = updateFee(feeCode, feeSched, "FINAL", quantity, invoiceFee);
          if (feeResult) {
              Avo_LogDebug("Fee " + feeCode + " has been added with quantity of " + quantity, 1);
          }
          else if (feeResult == null) {
              Avo_LogDebug("Fee " + feeCode + " has been adjusted to a quantity of " + quantity, 1);
          } else {
              Avo_LogDebug("Failed to add fee " + feeCode, 1);
          }
      }
     feeSched ="BLD_GEN";
      // #endregion FireDistrict
  
      // #region PV System
      var pvSys = String(getAppSpecific("PVSystem", capId));
      Avo_LogDebug("PV System(" + pvSys + ")", 2); //debug
  
      if (pvSys.toUpperCase() == "YES") {
          // Residential Solar PV kW
          feeCode = "BLD_017";
  
          var totalKw = parseFloat(getAppSpecific("Total kW", capId));
          Avo_LogDebug("Total kW(" + totalKw + ")", 2);   //debug
  
          if (isNaN(totalKw) == true || totalKw < 0) {
              Avo_LogDebug("Failed to add fee " + feeCode + ". (Invalid value for 'Total Kw')", 1);
              //return;
          }
          else {
            totalKw = Math.ceil(totalKw);
  
            if (totalKw > 0) {
              var projType = String(getAppSpecific("Project Type", capId));
              Avo_LogDebug("Project Type(" + projType + ")", 2);  //debug
  
              if (projType == "Residential") {
                  quantity = 520;
  
                  if (totalKw > 15) {
                      quantity += 17 * (totalKw - 15);
                  }
              }
  
              if (projType == "Commercial") {
                  feeCode = "BLD_128";
                  quantity = 1155;
  
                  var adjWattage = totalKw;
                  if (totalKw > 250) {
                      adjWattage = 250;
  
                      quantity += 6 * (totalKw - 250);
                  }
  
                  if (adjWattage > 50) {
                      quantity += 8 * (adjWattage - 50);
                  }
              }
            }
          
  
            if (quantity > 0) {
              feeResult = updateFee(feeCode, feeSched, "FINAL", quantity, invoiceFee);
              if (feeResult) {
                  Avo_LogDebug("Fee " + feeCode + " has been added with quantity of " + quantity, 1);
              }
              else if (feeResult == null) {
                  Avo_LogDebug("Fee " + feeCode + " has been adjusted to a quantity of " + quantity, 1);
              } else {
                  Avo_LogDebug("Failed to add fee " + feeCode, 1);
              }
            }
          }
  
          // Additional subpanels, load centers, and/or distribution panels
          feeCode = "BLD_061";
          quantity = 0;
  
          var pvNumPanels = parseFloat(getAppSpecific("Additional Panels", capId));
          Avo_LogDebug("PV Panels(" + pvNumPanels + ")", 2);   //debug
  
          if (isNaN(pvNumPanels) != true && pvNumPanels > 0) {
              quantity = 29 * pvNumPanels + 191;
  
              feeResult = updateFee(feeCode, feeSched, "FINAL", quantity, invoiceFee);
              if (feeResult) {
                  Avo_LogDebug("Fee " + feeCode + " has been added with quantity of " + quantity, 1);
              }
              else if (feeResult == null) {
                  Avo_LogDebug("Fee " + feeCode + " has been adjusted to a quantity of " + quantity, 1);
              } else {
                  Avo_LogDebug("Failed to add fee " + feeCode, 1);
              }
          }
  
          // Reroofing
          feeCode = "BLD_025";
          quantity = 191;
  
          var pvSolarPanelType = String(getAppSpecific("Solar Panel Type", capId));
          Avo_LogDebug("Solar Panel Type(" + pvSolarPanelType + ")", 2);   //debug
  
          if (pvSolarPanelType.toUpperCase() == "SOLAR ROOF TILES") {
  
              var totalSquares = parseFloat(getAppSpecific("Total Squares to be Replaced", capId));
              Avo_LogDebug("Total Squares to be Replaced(" + totalSquares + ")", 2);   //debug
  
              if (isNaN(totalSquares) != true && totalSquares > 0) {
                  if (totalSquares > 10) {
                      quantity += 116 * Math.ceil((totalSquares - 10) / 10);
                  }
  
                  feeResult = updateFee(feeCode, feeSched, "FINAL", quantity, invoiceFee);
                  if (feeResult) {
                      Avo_LogDebug("Fee " + feeCode + " has been added with quantity of " + quantity, 1);
                  }
                  else if (feeResult == null) {
                      Avo_LogDebug("Fee " + feeCode + " has been adjusted to a quantity of "
                          + quantity, 1);
                  } else {
                      Avo_LogDebug("Failed to add fee " + feeCode, 1);
                  }
              }
          }
      }
  
      // #endregion PV System
  
      // #region ESS System
      var essSys = String(getAppSpecific("ESSSystem", capId));
      Avo_LogDebug("ESS System(" + essSys + ")", 2); //debug
  
      if (essSys.toUpperCase() == "YES") {
          // Electric Storage System Installation
          feeCode = "BLD_060";
  
          var essNumEnergySys = parseFloat(getAppSpecific("Number of Energy Systems", capId));
          Avo_LogDebug("Total energy storage systems(" + essNumEnergySys + ")", 2);
  
          if (isNaN(essNumEnergySys) != true && essNumEnergySys > 0) {
              if (essNumEnergySys > 1) {
                quantity = 520 + 58 * (essNumEnergySys - 1);
              } else {
                quantity = 520;
              }
  
              feeResult = updateFee(feeCode, feeSched, "FINAL", quantity, invoiceFee);
              if (feeResult) {
                  Avo_LogDebug("Fee " + feeCode + " has been added with quantity of " + quantity, 1);
              }
              else if (feeResult == null) {
                  Avo_LogDebug("Fee " + feeCode + " has been adjusted to a quantity of " + quantity, 1);
              } else {
                  Avo_LogDebug("Failed to add fee " + feeCode, 1);
              }
          }
  
          // Additional subpanels, load centers, and/or distribution panels
          feeCode = "BLD_061";
  
          var essNumSubpanels = parseFloat(getAppSpecific("Additional Subpanels", capId));
          Avo_LogDebug("ESS Subpanels(" + essNumSubpanels + ")", 2);   //debug
  
          if (isNaN(essNumSubpanels) != true && essNumSubpanels > 0) {
              quantity = 29 * essNumSubpanels + 191;
  
              feeResult = updateFee(feeCode, feeSched, "FINAL", quantity, invoiceFee);
              if (feeResult) {
                  Avo_LogDebug("Fee " + feeCode + " has been added with quantity of " + quantity, 1);
              }
              else if (feeResult == null) {
                  Avo_LogDebug("Fee " + feeCode + " has been adjusted to a quantity of " + quantity, 1);
              } else {
                  Avo_LogDebug("Failed to add fee " + feeCode, 1);
              }
          }
      }
    }
    catch (err) {
      Avo_LogDebug("error caught: " + err, 2);
      logDebug("caught error: " + err);
    }
  
      // #endregion ESS System
      //aa.sendMail("noreply@smcgov.org","chelsea@grayquarter.com","","ctrca bld 513 debug","debug: " + debug);
      // Percentage fees
      // BLD_039, 040, 043
      include("BLD_016_ASA_ResPercentageFees");
  })();
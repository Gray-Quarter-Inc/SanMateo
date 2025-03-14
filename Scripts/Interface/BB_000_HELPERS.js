/*******************************************************
| Script: BB_000_HELPERS
| Created by: Tom Grzegorczyk   
| Created on: 3 Nov 2020
| Usage: Helper functions used in BlueBeam integration
| Modified by: ()
*********************************************************/
// Globals
var projectId = lookup("BB_CONFIGS", "PROJECT_ID");
var adapterUrl = lookup("BB_CONFIGS", "URL");

/// String polyfills
if (!String.prototype.startsWith) {
    Object.defineProperty(String.prototype, 'startsWith', {
        value: function (search, rawPos) {
            var pos = rawPos > 0 ? rawPos | 0 : 0;
            return this.substring(pos, pos + search.length) === search;
        }
    });
}
if (!String.prototype.endsWith) {
    String.prototype.endsWith = function (search, this_len) {
        if (this_len === undefined || this_len > this.length) {
            this_len = this.length;
        }
        return this.substring(this_len - search.length, this_len) === search;
    };
}
if (!String.prototype.includes) {
    String.prototype.includes = function (search, start) {
        'use strict';

        if (search instanceof RegExp) {
            throw TypeError('first argument must not be a RegExp');
        }
        if (start === undefined) { start = 0; }
        return this.indexOf(search, start) !== -1;
    };
}
/// End String polyfills

// Holds environment specific configuration
(function () {
    var config = JSON.parse(getScriptText("BB_CONFIGURATION"));
    var BluebeamConfig = config[0];

    this.BluebeamConfig = BluebeamConfig;
})(this);

// Holds parent folder structure mapping of BlueBeam Project integrated with current instance of Accela
(function () {
    var folders = JSON.parse(getScriptText("BB_FOLDERS"));
    var BluebeamFolders = function () {
        return BluebeamFolders;
    };

    function find(key, value) {
        var result = [];
        //aa.print(value);
        for (var i = 0; i < folders.length; i++) {
            //aa.print(folders[i][key]);
            if (folders[i][key] === value) {
                return folders[i];
            }
        }
        return null;
    }

    // By index
    BluebeamFolders.byIndex = function (index) {
        return BluebeamFolders()[index];
    };
    // By Id
    BluebeamFolders.byId = function (id) {
        return find("Id", id);
    };
    // By record type
    BluebeamFolders.byType = function (type) {
        return find("Type", type);
    };
    // By record alias
    BluebeamFolders.byAlias = function (alias) {
        return find("Alias", alias);
    };
    // By record module
    BluebeamFolders.byModule = function (module) {
        return find("Module", module);
    };
    // By directory name
    BluebeamFolders.byDirectory = function (directory) {
        return find("Directory", directory);
    };

    this.BluebeamFolders = BluebeamFolders;
})(this);

(function () {
    var actionTriggers = JSON.parse(getScriptText("BB_ACTIONTRIGGERS"));
    var BluebeamActionTriggers = function () {
        return BluebeamActionTriggers;
    };

    function find(key, value) {
        for (var i = 0; i < actionTriggers.length; i++) {
            if (actionTriggers[i][key] === value) {
                return actionTriggers[i];
            }
        }
        return null;
    }

    function findRecordTypeConfig(a) {
        var key = "Type";
        //Record Type array to match
        var aArr = a.split('/');
        for (var i = 0; i < actionTriggers.length; i++) {
            //Record type array in config
            var b = actionTriggers[i][key];
            var bArr = b.split('/');
            if (aArr.length > 3 && bArr.length > 3) {
                //Group check
                if (aArr[0] == bArr[0]) {
                    //Type check
                    if (bArr[1] == '*' || aArr[1] == bArr[1]) {
                        //Sub type check
                        if (bArr[2] == '*' || aArr[2] == bArr[2]) {
                            //Category check
                            if (bArr[3] == '*' || aArr[3] == bArr[3]) {
                                //Return config for a successful match
                                return actionTriggers[i];
                            }
                        }
                    }
                }
            }
        }
        //No match
        return null;
    }

    // By record type
    BluebeamActionTriggers.byType = function (a) {
        return findRecordTypeConfig(a);
    };

    this.BluebeamActionTriggers = BluebeamActionTriggers;
})(this);


// Basic number converter
(function () {
    var ConvertBase = function (num) {
        return {
            from: function (baseFrom) {
                return {
                    to: function (baseTo) {
                        return parseInt(num, baseFrom).toString(baseTo);
                    }
                };
            }
        };
    };

    // binary to decimal
    ConvertBase.bin2dec = function (num) {
        return ConvertBase(num)
            .from(2)
            .to(10);
    };
    // binary to hexadecimal
    ConvertBase.bin2hex = function (num) {
        return ConvertBase(num)
            .from(2)
            .to(16);
    };
    // decimal to binary
    ConvertBase.dec2bin = function (num) {
        return ConvertBase(num)
            .from(10)
            .to(2);
    };
    // decimal to hexadecimal
    ConvertBase.dec2hex = function (num) {
        return ConvertBase(num)
            .from(10)
            .to(16);
    };
    // hexadecimal to binary
    ConvertBase.hex2bin = function (num) {
        return ConvertBase(num)
            .from(16)
            .to(2);
    };

    // hexadecimal to decimal
    ConvertBase.hex2dec = function (num) {
        return ConvertBase(num)
            .from(16)
            .to(10);
    };

    this.ConvertBase = ConvertBase;
})(this);

// Returns Id of the Record Type folder within Bluebeam project
function GETRECORDTYPEFOLDER(recordType) {
    try {
        var folder = BluebeamFolders.byType(recordType);
        if (folder && folder.Id) {
            return folder.Id;
        } else {
            return null;
        }
    }
    catch (ex) {
        Avo_LogDebug("**Error in GETRECORDTYPEFOLDER(): " + ex.message, 1);
        return null;
    }
}
// Returns Id of the Record Module folder within Bluebeam project
function GETRECORDMODULEFOLDER(module) {
    try {
        var folder = BluebeamFolders.byModule(module);
        if (folder && folder.Id) {
            return folder.Id;
        } else {
            return null;
        }
    }
    catch (ex) {
        Avo_LogDebug("**Error in GETRECORDMODULEFOLDER(): " + ex.message, 1);
        return null;
    }
}
// Returns a Trigger object by record type and action
// Action values:
// download
// action
// Trigger object example:
//  {
//      "Task": "Review Distribution",
//      "Status": "Distributed",
//      "Action": "revision"
//  }
function GETACTIONTRIGGER(recordType, action) {
    try {
        var result = new Array();
        var actionTriggers = BluebeamActionTriggers.byType(recordType);
        if (actionTriggers && actionTriggers.Triggers) {
            var triggers = actionTriggers.Triggers;
            for (var i = 0; i < triggers.length; i++) {
                var trigger = triggers[i];
                if (trigger["Action"] === action) {
                    result.push(trigger);
                }
            }
        }
        return result;
    }
    catch (ex) {
        Avo_LogDebug("**Error in GETACTIONTRIGGER: " + ex.message, 1);
        return null;
    }
}
// Returns value of document ASI from provided forms object by group and a field name
function GETDOCUMENTASI(forms, groupName, fieldName) {
    for (i = 0; i < forms.size(); i++) {
        var form = forms.get(i);
        var subGroups = form.getSubgroups();
        //aa.print(Serialize(subGroups));
        for (j = 0; j < subGroups.size(); j++) {
            var group = subGroups.get(j);
            //aa.print(Serialize(group));
            if (group.subgroupName == groupName) {
                var fields = group.getFields();
                for (k = 0; k < fields.size(); k++) {
                    var field = group.fields.get(k);
                    //aa.print(Serialize(field));
                    if (field.getFieldName() == fieldName) {
                        return field.getDefaultValue();
                    }
                }
            }
        }
    }
    return null;
}
// Sets new value of document ASI in provided forms object where group name and filed name matches
function EDITDOCUMENTASI(template, groupName, fieldName, fieldValue, documentModel) {
    var forms = template.templateForms;
    for (i = 0; i < forms.size(); i++) {
        var form = forms.get(i);
        var subGroups = form.getSubgroups();
        for (j = 0; j < subGroups.size(); j++) {
            var group = subGroups.get(j);
            if (group.subgroupName == groupName) {
                var fields = group.getFields();
                for (k = 0; k < fields.size(); k++) {
                    var field = group.fields.get(k);
                    if (field.getFieldName() == fieldName) {
                        field.setDefaultValue(fieldValue);

                        var updateResult;
                        //This IF statement checks to see which event is triggering this function, DocumentUpdateAfter events do not capture the TEMPLATE so it needs to be added
                        if (aa.env.getValue("EventName") == 'DocumentUpdateAfter') {
                            documentModel.setTemplate(template);
                        }
                        documentModel.template.templateForms.set(i, form);
                        updateResult = aa.document.updateDocument(documentModel);

                        if (updateResult.getSuccess()) {
                            Avo_LogDebug("ASI[" + fieldName + "] updated successfully");
                        } else {
                            Avo_LogDebug("*Warning: ASI[" + fieldName + "] update failed!");
                        }
                    }
                }
            }
        }
    }
}

// Returns an email address of the user assigned to workflow task
function GETEMAILASSIGNEDTOWORKFLOWTASK(assignedStaff) {
    try {
        if (assignedStaff == null) {
            return null;
        } else {
            assignedStaff = String(assignedStaff);
        }
        //Avo_LogDebug("Assigned(" + assignedStaff + ")");	//debug

        var index = assignedStaff.lastIndexOf("/");
        //Avo_LogDebug("Index(" + index + ")");	//debug

        var deptKey = assignedStaff.substring(0, index);
        deptKey = aa.getServiceProviderCode() + "/" + deptKey;
        //Avo_LogDebug("Dept(" + deptKey + ")");	//debug

        var fullName = "Admin";
        if (assignedStaff.substring(index + 1)) {
            fullName = assignedStaff.substring(index + 1);
        }
        //Avo_LogDebug("Dept key(" + deptKey + ")");	//debug
        //Avo_LogDebug("Full name(" + fullName + ")");	//debug

        var deptName = null;
        var allDepts = aa.people.getDepartmentList(null).getOutput();
        for (j in allDepts) {
            var dept = allDepts[j];

            if (dept.deptKey != deptKey) {
                continue;
            }

            deptName = dept.deptName;
            break;
        }
        //Avo_LogDebug("Dept(" + deptName + ")");

        var result;
        if (fullName.indexOf(" ") == -1) {
            result = aa.people.getUsersByUserIdAndName(fullName, null, null, null);
        } else {
            var names = fullName.split(" ");
            result = aa.people.getUsersByUserIdAndName(
                null,
                names[0],
                null,
                names[names.length - 1]
            );
        }

        if (result.getSuccess() == true) {
            var allUsers = result.getOutput();
            for (k in allUsers) {
                var user = allUsers[k];
                //Avo_LogDebug(user.deptOfUser);
                //Avo_LogDebug(user.fullName);
                //Avo_LogDebug(user.userID);
                //Avo_LogDebug(user.getEmail());

                var email = user.getEmail();
                if (email != null || email != "" || email != undefined) {
                    return email;
                }
            }
        }
        return null;
    } catch (ex) {
        Avo_LogDebug("**Error in GETUSERASSIGNEDTOWORKFLOWTASK: " + ex.message, 1);
        return null;
    }
}

// Returns an email address of the user assigned to record
function GETEMAILASSIGNEDTOCAP(capId) {
    try {
        var capDetail = aa.cap.getCapDetail(capId).getOutput();
        if (!capDetail) {
            return null;
        }
        var assignedStaff = capDetail.asgnStaff;
        Avo_LogDebug("Assigned Staff: " + assignedStaff, 2);
        if (assignedStaff == null || assignedStaff == "") {
            return null;
        }
        var result = aa.people.getUsersByUserIdAndName(assignedStaff, null, null, null);
        if (result.getSuccess() == true) {
            var allUsers = result.getOutput();
            for (k in allUsers) {
                var user = allUsers[k];
                //Avo_LogDebug(user.deptOfUser);
                //Avo_LogDebug(user.fullName);
                //Avo_LogDebug(user.userID);
                //Avo_LogDebug(user.getEmail());

                var email = user.getEmail();
                if (email != null || email != "" || email != undefined) {
                    return email;
                }
            }
        }
        return null;
    } catch (ex) {
        Avo_LogDebug("**Error in GETUSERASSIGNEDTOWORKFLOWTASK: " + ex.message, 1);
        return null;
    }
}

function updateDocumentNames(altId, module) {
    var revision = getAppSpecific("Revision Number");
    if (revision == null || revision == "" || revision == undefined) {
        revision = 0;
    }
    var revisionCounter = revision.length > 1 ? revision : ("0" + revision);

    var subCycle = getAppSpecific("Submittal Cycle");
    if (subCycle == null || subCycle == "") {
        subCycle = 1;
    }
    var subCounter = subCycle.length > 1 ? subCycle : ("0" + subCycle);

    var resubCycle = getAppSpecific("Resubmittal Cycle");
    if (resubCycle == null || resubCycle == "") {
        resubCycle = 0;
    }
    var resubCounter = resubCycle.length > 1 ? resubCycle : ("0" + resubCycle);
    var allDocs = null;
    var result = aa.document.getCapDocumentList(capId, "ADMIN");
    if (result.getSuccess() == true) {
        allDocs = result.getOutput();
    }

    for (x in allDocs) {
        try {
            var docModel = allDocs[x];

            var documentNo = docModel.documentNo;
            Avo_LogDebug("documentNo: " + documentNo, 2);
            var document = aa.document.getDocumentByPK(documentNo).getOutput();
            var oldName = document.fileName;
            var fileName = document.getFileName();
            var numIndex = fileName.lastIndexOf(".");
            var extension = fileName.substr(numIndex);
            var category = document.docCategory;
            var addressPart = getAddressPart();
            var newName = "";
            if (module.toUpperCase() == "PUBLICWORKS") {
                var catCode = getDocumentProperty(category, 1);
                var positionCode = getDocumentProperty(category, 2);
                newName = positionCode + "_" + altId + "_" + addressPart + "_" + catCode + "_Sub" + subCounter + "_Rev" + revisionCounter + "_" + resubCounter;
            } else {
                var catCode = getDocumentProperty(category, 1);
                if (subCounter == 0) {
                    newName = altId + "_" + addressPart + "_" + catCode;
                } else {
                    newName = "RESUB" + subCounter + "_" + altId + "_" + addressPart + "_" + catCode;//altId + "_" + addressPart + "_" + catCode + "_Sub" + subCounter + "_Rev" + revisionCounter + "_" + resubCounter;
                }
            }
            Avo_LogDebug("Checking for duplicate names ", 2);
            var duplicateCounter = checkForDuplicates(allDocs, newName, extension);
            if (duplicateCounter > 0) {
                Avo_LogDebug(duplicateCounter + " duplicate(s) found. Renaming.", 2);
                newName += "[" + duplicateCounter + "]";
            }
            newName += extension;
            document.setDocName(newName);
            document.setFileName(newName);

            var updateResult = aa.document.updateDocument(document);
            if (updateResult.getSuccess()) {
                Avo_LogDebug("Document number " + documentNo + " renamed successfully! ", 1);
                Avo_LogDebug(oldName + " ==> " + newName, 2);
            } else {
                Avo_LogDebug("*Warning: Failed to rename document " + oldName, 1);
            }
        } catch (ex) {
            Avo_LogDebug("**Error in updateDocumentNames(): " + ex.message, 1);
        }
    }

}

function getDocumentProperty(category, position) {
    var docCode = '';
    try {
        var catArr = String(category).split(/\|/);
        if (catArr.length > 1) {
            docCode = String(catArr[position].trim());
        }
    } catch (ex) {

    }
    return docCode;
}

function checkForDuplicates(documentModelList, search, searchExtension) {
    var duplicateCounter = 0;
    try {
        for (x in documentModelList) {
            var docModel = documentModelList[x];
            var docName = docModel.docName;
            var fileName = docModel.fileName;
            var numIndex = fileName.lastIndexOf(".");
            var extension = fileName.substr(numIndex);
            Avo_LogDebug("docName: " + docName, 2);
            Avo_LogDebug("extension: " + extension, 2);
            if (docName.indexOf(search) > -1 && extension == searchExtension) {
                duplicateCounter++;
            }
            Avo_LogDebug("duplicateCounter: " + duplicateCounter, 2);
        }
    } catch (ex) {
        Avo_LogDebug("**Error in checkForDuplicates(): " + ex.message, 1);
    }
    return duplicateCounter;
}

function getAddressPart() {
    var result = aa.address.getAddressByCapId(capId);
    if (result.getSuccess() != true) {
        log('Failed to get addresses on record ' + altId + '. ' + result.errorType + ": " + result.errorMessage, 1);
    }

    var addr = "";
    var allAddressModels = result.getOutput();
    for (var i in allAddressModels) {
        var addressModel = allAddressModels[i];
        if (allAddressModels.length > 1 && addressModel.primaryFlag != "Y") {
            continue;
        }
        if (!addr || addr.length == 0 || addr.toLowerCase() == "null") {
            //remove spaces
            addr = String(addressModel.houseNumberStart + ' ' + addressModel.streetName + ' ' + addressModel.streetSuffix);
            //take up to 10 characters
        }

        break;
    }
    return addr;
}
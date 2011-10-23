/**

 *  

 * @return Object literal singleton instance of Zim

 */

var Zim = function() {
	this.zimFileName = "";
	this.zimFileOpen = false;		
};

Zim.prototype.hasZimFileOpen = function() {
	return this.zimFileOpen;
};

/**
@param zimFileName The zim file to use
*/
Zim.prototype.open = function(zimFileName) {
	//TODO real functionality
	this.zimFileName = zimFileName;	
	this.zimFileOpen = true;
}

Zim.prototype.close = function() {
	this.zimFileName = "";	
	this.zimFileOpen = false;
}

/**
  * @param directory The directory for which we want the listing
  * @param successCallback The callback which will be called when directory listing is successful
  * @param failureCallback The callback which will be called when directory listing encouters an error
  */
Zim.prototype.list = function(directory,successCallback, failureCallback) {

 return PhoneGap.exec(    successCallback,    //Success callback from the plugin

      failureCallback,     //Error callback from the plugin

      'ZimPhoneGapPlugin',  //Tell PhoneGap to run "DirectoryListingPlugin" Plugin

      'list',              //Tell plugin, which action we want to perform

      [directory]);        //Passing list of args to the plugin

};

/**
 * @param article The title url (see isUrl paramter) of the article to be retrieved
 * @param nameSpace	The namesepace. e.g. 'A' for article 'I' for images
 * @param isUrl true if article is an url, false if it as title
 * @param successCallback The callback which will be called when retrieving the article data is successful
 * @param failureCallback The callback which will be called when retrieving the article data encounters an error
 */

Zim.prototype.getArticleData = function(article, nameSpace, isUrl, successCallback, failureCallback) {
	return PhoneGap.exec(    successCallback,    //Success callback from the plugin

	      failureCallback,     //Error callback from the plugin

	      'ZimPhoneGapPlugin',  //Tell PhoneGap to run "ZimPhoneGapPlugin" Plugin

	      'getArticleData',              //Tell plugin, which action we want to perform
	      [this.zimFileName,article, nameSpace, isUrl]);        //Passing list of args to the plugin
	
	};


PhoneGap.addConstructor(function() {

                   PhoneGap.addPlugin("zim", new Zim());                   

               });
/**
 * 
 */
package com.trial.phonegap.plugin.zim;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.net.URLDecoder;

import org.json.JSONArray;

import org.json.JSONException;

import org.json.JSONObject;
import org.openzim.ZIMTypes.ZIMFile;
import org.openzim.ZIMTypes.ZIMReader;

import android.util.Log;

import com.phonegap.api.Plugin;

import com.phonegap.api.PluginResult;

import com.phonegap.api.PluginResult.Status;
/**
 * @author Christian
 *
 */
public class ZimPhoneGapPlugin extends Plugin {

	/** List Action */

	public static final String ACTION_GETARTICLEDATA="getArticleData";

	/*

	* (non-Javadoc)

	* 

	* @see com.phonegap.api.Plugin#execute(java.lang.String,

	* org.json.JSONArray, java.lang.String)

	*/

	@Override
	public PluginResult execute(String action, JSONArray data, String callbackId) {
		Log.d("zimgap", "Plugin Called");

		PluginResult result = null;

		if (ACTION_GETARTICLEDATA.equals(action)) {
			try {
				String zimFileName = data.getString(0);
				String articleTitle = data.getString(1);
				
				String nameSpace = data.getString(2);
				boolean isUrl = data.getBoolean(3);
				if (nameSpace.length()!=  1) {
					throw new JSONException("nameSpace parameter is not a char");
				}
				JSONObject articleData = getArticleData(zimFileName,articleTitle,nameSpace.charAt(0), isUrl);
				if (articleData.isNull("articletext")) {
					throw new JSONException("Article "+articleTitle+ " not found in namespace "+ nameSpace + " in file "+zimFileName);
				}
				Log.d("zimgap", "article loaded");			

				result = new PluginResult(Status.OK, articleData);
				Log.d("zimgap", "PluginResult finished");

			}  catch (JSONException jsonEx) {

				Log.d("zimgap", "Got JSON Exception "+ jsonEx.getMessage());

				result = new PluginResult(Status.JSON_EXCEPTION);

			}

		}

		else {

			result = new PluginResult(Status.INVALID_ACTION);

			Log.d("zimgap", "Invalid action : "+action+" passed");

		}

		return result;
	}
	private JSONObject getArticleData(String zimFileName, String article, char nameSpace, boolean isUrl) throws JSONException {
		JSONObject articleData = new JSONObject();
        File zimFile = new File(zimFileName);
        ZIMFile file = new ZIMFile(zimFileName);
		// Associate the Zim File with a Reader
		ZIMReader zReader = new ZIMReader(file);

		if (isUrl) {
			String articleTitle = URLDecoder.decode(article);
			//Note that it still does not work, as appearantly the java zimlib does not handle unicode correctly.
			// A second problem is probably that zimreader always uses the title pointer list to find an article,
			// this won't work if urls and title are different.
			Log.d("zimgap", " getArticleData isUrl was true. article " +article+" decoded to title "+articleTitle);		
			article = articleTitle;
			
			//FIXME: For now just remove baseuri when loading images.(Should in general remove namespace
			// part of url)
			
			article = article.replaceFirst("file:///I/","");
			
			
		}
		
		try {
			
			ByteArrayOutputStream articleDataByteArray = zReader.getArticleData(article,nameSpace);
			Log.d("zimgap","zReader.getArticleData(articleTitle,nameSpace) done");
			if (articleDataByteArray==null) {
				Log.w("zimgap", "Article \""+article+"\" not found");
			} else {
				String articleText = null;
				if (nameSpace=='A') {
					articleText = articleDataByteArray.toString("utf-8");
					Log.d("zimgap","articleDataByteArray.toString(\"utf-8\") done");
				} else if (nameSpace=='I') {
					//FIXME: don't hardcode image type
					articleText = "data:image/jpg;base64,".concat(Base64.encodeBytes(articleDataByteArray.toByteArray()));
					Log.d("zimgap","base64 encoding done");
				} else {
					throw new JSONException("nameSpace "+nameSpace+ " not supported.");
				}
				articleData.put("articletext", articleText);
				articleData.put("articletitle", article);
				//Working: articleData.put("articletext", "data:image/gif;base64,R0lGODlhUAAPAKIAAAsLav///88PD9WqsYmApmZmZtZfYmdakyH5BAQUAP8ALAAAAABQAA8AAAPbWLrc/jDKSVe4OOvNu/9gqARDSRBHegyGMahqO4R0bQcjIQ8E4BMCQc930JluyGRmdAAcdiigMLVrApTYWy5FKM1IQe+Mp+L4rphz+qIOBAUYeCY4p2tGrJZeH9y79mZsawFoaIRxF3JyiYxuHiMGb5KTkpFvZj4ZbYeCiXaOiKBwnxh4fnt9e3ktgZyHhrChinONs3cFAShFF2JhvCZlG5uchYNun5eedRxMAF15XEFRXgZWWdciuM8GCmdSQ84lLQfY5R14wDB5Lyon4ubwS7jx9NcV9/j5+g4JADs=");	
				Log.d("zimgap","Article \""+article+"\" read successfully");
			}
		} catch (IOException e) {
			e.printStackTrace();
		}	

		return articleData;		
	}
	
	public boolean onOverrideUrlLoading(String url) {
		Log.d("zimgap","onOverrideUrlLoading: Url: "+url);
		return true;
    }
}

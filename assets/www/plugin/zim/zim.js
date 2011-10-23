
	var startTime;
		/*document.addEventListener('deviceready', function() {
			var btn = document.getElementById("loadarticle");
			btn.onclick = loadArticle;
			btn.disabled = false;
			console.log("event deviceready processed");
			//printTags('img');
			loadImagesFromZimFile();			
		}, true);*/

		function printTags(tag) {
			console.log("in printImageTags("+tag+")");			
			imgs=document.getElementsByTagName(tag);
			 for(i in imgs)
			  {
				 console.log(imgs[i]);
				 console.log("Replace image src ("+imgs[i].src+") with dataurl");
				 imgs[i].src=imgs[0].src;
			  }
			
		}
		
		function loadImagesFromZimFile() {
			console.log("loadImagesFromZimFile()");			
			imgs=document.getElementById('main').getElementsByTagName('img');
			 for(i in imgs)  //FIXME for some reason non existing images, and same images multiples times used
			 	//(Multiple may be really multiple times used => check, if true only load once from zim and assign to all images with same source)
			  {
				/* console.out("imgs[i]==undefined : "+imgs[i]==undefined);
				 console.out("imgs[i]==null : "+imgs[i]==null);
					 
			  	console.out("imgs[i]===undefined : "+imgs[i]===undefined);
			  	console.out("imgs[i]===null : "+imgs[i]===null);*/
				if (imgs[i] && imgs[i].src) {
				// if (visible(imgs[i])) {
					console.log("Image ("+imgs[i].src+") is visible. Load it from zimfile");
				 	window.plugins.zim.getArticleData( 
				 			imgs[i].src, "I",

			function(r) {				 		
				console.log("Image "+r.articletitle+ " loaded. Find image element...");						
				var imgs=document.getElementsByTagName('img');
				 for(i in imgs)
				 {
					 var re = new RegExp(r.articletitle);
				  if(re.test(imgs[i].src))
				   {
				    	console.log("found image element ("+imgs[i].src+").Assign as dataurl");
				    	imgs[i].src=r.articletext;
				   } else {
					   console.log("Image element ("+imgs[i].src+") is not loaded image. Inspect next element");
				   }
				}
				
				//imgs[0].src=r.articletext;
				console.log("r: "+r.articletext);
				console.log("hardcoded: "+"data:image/gif;base64,R0lGODlhUAAPAKIAAAsLav///88PD9WqsYmApmZmZtZfYmdakyH5BAQUAP8ALAAAAABQAA8AAAPbWLrc/jDKSVe4OOvNu/9gqARDSRBHegyGMahqO4R0bQcjIQ8E4BMCQc930JluyGRmdAAcdiigMLVrApTYWy5FKM1IQe+Mp+L4rphz+qIOBAUYeCY4p2tGrJZeH9y79mZsawFoaIRxF3JyiYxuHiMGb5KTkpFvZj4ZbYeCiXaOiKBwnxh4fnt9e3ktgZyHhrChinONs3cFAShFF2JhvCZlG5uchYNun5eedRxMAF15XEFRXgZWWdciuM8GCmdSQ84lLQfY5R14wDB5Lyon4ubwS7jx9NcV9/j5+g4JADs=");
				//Working imgs[0].src="data:image/gif;base64,R0lGODlhUAAPAKIAAAsLav///88PD9WqsYmApmZmZtZfYmdakyH5BAQUAP8ALAAAAABQAA8AAAPbWLrc/jDKSVe4OOvNu/9gqARDSRBHegyGMahqO4R0bQcjIQ8E4BMCQc930JluyGRmdAAcdiigMLVrApTYWy5FKM1IQe+Mp+L4rphz+qIOBAUYeCY4p2tGrJZeH9y79mZsawFoaIRxF3JyiYxuHiMGb5KTkpFvZj4ZbYeCiXaOiKBwnxh4fnt9e3ktgZyHhrChinONs3cFAShFF2JhvCZlG5uchYNun5eedRxMAF15XEFRXgZWWdciuM8GCmdSQ84lLQfY5R14wDB5Lyon4ubwS7jx9NcV9/j5+g4JADs=";
			},

			function(e) {
				console.log("Error loading image"+e);
			}

			);
					}
			}			 
		}
		
		function hideZimContent() {
			//Probably not sufficient for all cases.
			$('#zimContent').hide();			
			$('#zimStatus').hide();
			$('#zimFileName').hide();
			$('#content').show();
			
		}
		
		function showZimContent() {
			$('#content').hide();
			//Only hide main content, but not the header
			// as also used for zim searching
			$('#zimContent').show();
			$('#zimStatus').show();
			$('#zimFileName').show();
		}
		
		function openZimFile() {
			window.plugins.zim.open(document.getElementById("zimFileName").value);
			showZimContent();
			showStatus("Use search field to open articles in zim file defined above")
		}
		
		function loadArticle(articleTitle) {
			clearArticle();
			//Hide zimfile name after first load.
			$('#zimFileName').hide();			
			showStatus("Loading article "
					+ articleTitle
					+ " from file: "
					+ window.plugins.zim.zimFileName);
			var startTime = new Date().getTime();			
			window.plugins.zim.getArticleData( articleTitle, "A",

			function(r) {
				showStatus("Article loaded. Render article...");
				var loadedTime = new Date().getTime();				
				var loadTime = loadedTime - startTime;				
				showArticle(r);
				var end = new Date().getTime();
				var renderTime = end - loadedTime;
				//loadImagesFromZimFile();
				// A little useless, as hiden in next. (but at least printed to console)
				showStatus("Article rendered. Load time: "+loadTime+"ms\n\t Render time: "+renderTime+" ms");			
				$("#zimStatus").hide();
				$('#search').removeClass('inProgress');			    
			},

			function(e) {
				showStatus("Error loading article");
				console.log(e);
				$('#search').removeClass('inProgress');				
			}

			);
		}
		
		function isLinkInSameArticle(url) {
			if (url.indexOf("#")==0)
				//Try whether works without reloading
				return 1;			
			return 0;
		}
		
		function isExternalLink(url) {
			if  (url.indexOf("http://") == 0) {
				return 1;
			} else if (url.indexOf("https://") == 0) {
				return 1;
			}
			return 0;
		}
		
		function showStatus(status) {
			console.log("showStatus. status: "+status)
			$("#zimStatus").html(status);
			$("#zimStatus").show();
		}

		function clearArticle() {
			$("#zimContent").html("");			
			$("#zimStatus").hide();
		}
		function showArticle(articleText) {
			
			console.log("Openend article from zimefile. Display article text.")
			//Basically could reuse the "main" iframe as well. Problem is that then text is
			// not wrapped. Reason is probably that zim content currently is not a full html page
			// Note: There are plans to support getting a full html page (content+template) in the
			// future may make sense to change this here again to use the/an iframe.
			$("#zimContent").html(articleText.articletext);
			$("#zimContent a").click(function(event){
 				 var target = $(this).attr('href');
				 console.log("Link in offline article clicked. Link URL: " +target)
				 if (isExternalLink(target)) {
					 console.log("Link appears to be external link. Open in broswer")
					 // Stop the link from opening in the iframe...
					 event.preventDefault();
					 
					 // And open it in parent context for reals.
					 //
					 // This seems to successfully launch the native browser, and works
					 // both with the stock browser and Firefox as user's default browser
					 document.location = target; 
						
				 } else if (isLinkInSameArticle(target)) {
					 console.log("Link appears to be link to already open article. Use default handling")
				 } else {
					 console.log("Link appears to be zim internal.\n" +
						 		"Try opening article from zim file. Url: " + target)
					 event.preventDefault();					 
					 loadArticle(target)		     
				 }
 				 
				 
			   });
		}		
		
		function visible(element) {
			  if (element.offsetWidth === 0 || element.offsetHeight === 0) return false;
			  var height = document.documentElement.clientHeight,
			      rects = element.getClientRects(),
			      on_top = function(r) {
			        var x = (r.left + r.right)/2, y = (r.top + r.bottom)/2;
			        document.elementFromPoint(x, y) === element;
			      };
			  for (var i = 0, l = rects.length; i < l; i++) {
			    var r = rects[i],
			        in_viewport = r.top > 0 ? r.top <= height : (r.bottom > 0 && r.bottom <= height);
			    if (in_viewport && on_top(r)) return true;
			  }
			  return false;
			}

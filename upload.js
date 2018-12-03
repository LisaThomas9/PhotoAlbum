$(document).ready( function() {
    	$(document).on('change', '.btn-file :file', function() {
		var input = $(this),
			label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
		input.trigger('fileselect', [label]);
		});

		$('.btn-file :file').on('fileselect', function(event, label) {
		    
		    var input = $(this).parents('.input-group').find(':text'),
		    log = label;
		    if( input.length ) {
		        input.val(log);
		    } else {
		        if( log ) alert(log);
		    }
	    
		});
		function readURL(input) {
		    if (input.files && input.files[0]) {
		        var reader = new FileReader();
		        file1 = input.files[0]

		        reader.onload = function (e) {
		            $('#img-upload').attr('src', e.target.result);
		            img_file = e.target.result.split(",")[1]
		            file_name = input.files[0].name;
		        }
		        
		        reader.readAsDataURL(input.files[0]);
		    }
		}

		$("#imgInp").change(function(){
		    readURL(this);
		});

		$("#upload").click(function(){
			if (file1) {   
				alert(file1.name)
                AWS.config.update({
                    "accessKeyId": "",
                    "secretAccessKey": "",
                    "region": "us-east-1"
                });

                var s3 = new AWS.S3();
                var params = {
                    Bucket: 'b2photos',
                    Key: file1.name,
                    ContentType: file1.type,
                    Body: file1,
                    ACL: 'public-read'
                };  

                 s3.putObject(params, function (err, res) {
                    if (err) {
                        alert("Error uploading data"+err);
                    } else {
                        alert("Successfully uploaded data");
                    }
                });
            }
            else
            {
            	alert("No file to upload");
            }
        });
		/*
		$("#upload").click(function(){
			  var additionalParams = {
			  // If there are any unmodeled query parameters or headers that must be
			  //   sent with the request, add them here.
			  headers: {
			    'Content-Type': 'image/jpeg'
			  }
			};

			alert(file1.name)
			params = {
				"item" : file_name,
				"Content-Type" : "image/jpeg"
			}
			
			body = 
			{
				"file":file1
			}

			apigClient.uploadItemPut(params, body, additionalParams)
	          .then(function(result){
	          	alert("Success !!")
	            // Add success callback code here.
	          }).catch( function(result){
	            alert("Ooops !!")
	            // Add error callback code here.
	          });	
		})
		*/
		$("#search").click(function(){
			q = $("#query").val()
			alert(q)
			if($.trim(q) == '') {
				alert("Enter a proper search query")
		        return false;
		    }
			params = {
				"q" : q
			}
			body = {};

			apigClient.searchGet(params, body)
	          .then(function(result){
	          	alert("Success !!")
	          	images = result.data.results
	          	//iterate over the image objects and set img src
	          	alert(images.length)
	          	if(images.length > 0)
	          	{
	          		alert(images[0].url)
	          		for(i=0;i<images.length;++i)
	          		{
	          			src = images[i].url
	          			$('<div class="gallery"><img class="result" src="'+src+'" alt="" /></div>').appendTo(document.body);
					    
	          		}
	          	}
	          	else
	          	{
	          		//no images found
	          		alert("No images found")
	          	}

	          }).catch( function(result){
	            alert("Ooops !!")
	            // Add error callback code here.
	          });	
		})

		var apigClient = apigClientFactory.newClient();
	});

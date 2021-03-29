function readURL(input) {

// checks if input is a file and has a name
if (input.files && input.files[0]) {

    // creates FileReader object
    var reader = new FileReader();

    // when file is uploaded, runs function
    // e is the file uploaded
    reader.onload = function (e) {

        // makes image container visible
        $("#edit").css("display", "inline-block");
        $('#edit').css("height", "300px");

        // adds black border to cropping tool
        $('#crop').css("border", "2px black solid");

        // creates image that goes behind cropping tool to display which parts
        // of the image will be cropped out
        // e.target.result gets the path to the image
        $('#sizing').attr("src", e.target.result);
        $('#sizing').css("height", "300px");
        $('#sizing').css("opacity", ".4");

        // creates image that will be clipped to be the size of the cropping tool
        // to show user which part of the image will be included in the cropped version
        $('#imgfocus').attr("src", e.target.result);
        $('#imgfocus').css("height", "300px");
        $('#imgfocus').css("position", "absolute");

    };

    // used to read the contents of the specified file
    reader.readAsDataURL(input.files[0]);

  }
}

// runs when a new image is uploaded to ensure the image is fully loaded before running
$("#sizing").on('load', function() {

  // default position for cropping tool
  var xPos = 0;
  var yPos = 0;

  // default width and height of cropping tool
  var width = 100;
  var height = 100;

  // setting values as defaults in case user does not change values
  $('#width').val(width);
  $('#height').val(height);
  $('#posX').val(xPos);
  $('#posY').val(yPos);

  // taking the copy of the image and making a clip of it that is the size of the cropping tool
  // this gives it the effect of dark image outside of the cropping tool
  $('#imgfocus').css("clip-path", `inset(${yPos}px ${$('#edit').width()-width-xPos}px ${$('#edit').height()-height-yPos}px ${xPos}px)`);

  // gets current distance from right
  var getCurrentBlockRight = function ($currentBlock) {
    var $parent = $currentBlock.parent();
    return $currentBlock.offset().left + $currentBlock.outerWidth() - $parent.offset().left;
  };

  // gets current distance from top
  var getCurrentBlockUp = function ($currentBlock) {
    var $parent = $currentBlock.parent();
    return $currentBlock.offset().top + $currentBlock.outerHeight() - $parent.offset().top;
  };

  // creates cropping tool
  // the cropping tool is resizable and draggable (jQuery)
  $("#crop" ).resizable({

    // sets maxWidth and maxHeight of cropping tool
    maxWidth: $('#edit').width(),
    maxHeight: 300,

    // function that runs when the cropping tool loads
    start: function (event, ui) {

        // gets current width and height of cropping tool
        var $currentBlock = $(this);
        width = $(this).width();
        height = $(this).height();

        // adjusts maxWidth and maxHeight so that the cropping tool cannot be resized
        // to a size larger than the image
        $currentBlock.resizable("option", "maxWidth", width + $('#edit').width() - getCurrentBlockRight($currentBlock));
        $currentBlock.resizable("option", "maxHeight", height + 300 - getCurrentBlockUp($currentBlock));
    },

    // function that runs when the user stops adjusting the size of the cropping tool
    stop: function(event, ui) {

      // gets width and height of the cropping tool
      width = ui.size.width;
      height = ui.size.height;

      // adjusts the focused area by upading the clip-path
      $('#imgfocus').css("clip-path", `inset(${yPos}px ${$('#edit').width()-width-xPos}px ${$('#edit').height()-height-yPos}px ${xPos}px)`);

      // sets the width and height inputs to the new values
      $('#width').val(Math.round(width));
      $('#height').val(Math.round(height));

    }
  }).draggable({

    // keeps cropping tool from being moved outside of the parent div (#edit)
    containment: "parent",

    // runs when the user drags the cropping tool
    drag: function() {

      // gets the current offset
      var offset = $(this).offset();

      // xPos and yPos are distance from the upper left corner of the image
      xPos = offset.left - $("#edit").offset().left;
      yPos = offset.top - $("#edit").offset().top;

      // sets the posX and poxY inputs to the new values
      $('#posX').val(Math.round(xPos));
      $('#posY').val(Math.round(yPos));

    },

    // runs when the user stops moving the cropping tool
    stop: function(event, ui) {

      var offset = $(this).offset();
      xPos = offset.left - $("#edit").offset().left;
      yPos = offset.top - $("#edit").offset().top;

      // updates the clip-path with new location
      $('#imgfocus').css("clip-path", `inset(${yPos}px ${$('#edit').width()-width-xPos}px ${$('#edit').height()-height-yPos}px ${xPos}px)`);
    }
  });

  // styles cropping tool
  $("#crop").css({
    "position":"relative",
    "top":"-300px",
    "display":"block",
    "width":"100px",
    "height":"100px"
  });
});

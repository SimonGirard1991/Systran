jQuery(function($) {
  'use strict';

  // Function to call the SYSTRAN Translate Api translate/
  function translate(source, target, content, callback) {
    $.ajax({
      method:'GET',
      url: 'https://api-platform.systran.net/translation/text/translate?key=f4fb49b9-6937-476c-aca8-2a88c09f0364',
      dataType: 'text',
      data: {
        source: source,
        target: target,
        input: content
      },
      success: function(data) {
        if (typeof data === 'string')
          try {
            data = JSON.parse(data);
          } catch (exp) {

          }

        var err;

        if (data && data.outputs && Array.isArray(data.outputs)) {
          data = data.outputs[0];

          if (data && data.output)
            data = data.output;

          if (data && data.error)
            err = data.error;
        }

        callback(err, data);
      },
      error: function(xhr, status, err) {
        callback(err);
      }
    });
  }

  function getTextFromHtml(content) {
    content = content.replace(/<div>(?:<br>)?/gi, '\n').replace(/<\/div>/gi, '');
    content = content.replace(/<p>&nbsp;<\/p>/gi, '\n').replace(/<p>/gi, '').replace(/\n*<\/p>/gi, '\n');
    content = content.replace(/<br[ \/]*>/gi, '\n');
    content = content.replace(/&nbsp;/gi, ' ');
    content = content.replace(/<([^> ]*)[^>]*>/gi, '');  //clean html markup
    content = content.replace(/&lt;/gi, "<").replace(/&gt;/gi, ">"); //unescape some entities
    return content;
  }

  var $inputTextEditor = $('#inputTextEditor');
  var $outputTextEditor = $('#outputTextEditor');
  var $translating = $('#translating');
  var $source = $('#source');
  var $target = $('#target');

  function launchTranslation() {
    $translating.removeClass('hidden');
    //Extract text to translate
    var toTranslate = getTextFromHtml($inputTextEditor.html());

    if($source.val() != 'en' && $target.val() != 'en'){

      translate($source.val(), 'en', toTranslate, function(err, result) {

        if (!err) {
          translate('en', $target.val(), result, function(err, result) {
            $translating.addClass('hidden');
            if (!err) {
              //Show result
              $outputTextEditor.text(result);
            } else {
              if (console.log)
                console.log('Error while doing translation: ' + err);
            }
          });
        
        } else {
        if (console.log)
          console.log('Error while doing translation: ' + err);
        }
      });
    }
    else if ($source.val() == $target.val()){
      $outputTextEditor.text(toTranslate);
    }
    else{
      translate($source.val(), $target.val(), toTranslate, function(err, result) {
      $translating.addClass('hidden');
      if (!err) {
        //Show result
        $outputTextEditor.text(result);
      } else {
        if (console.log)
          console.log('Error while doing translation: ' + err);
      }
    });
    }
  }

  $('#translateButton').click(launchTranslation);
  launchTranslation();
});
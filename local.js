//ZIEN chrome extension localisation
//It's easy to add your own language!
//Add a new one in the localization-object and the language will be an option automatically.

var localization = {

  //English
  EN: {
    INTRO: '"What\'s it like being visually impaired?" As a well-sighted person you\'ll likely never fully get to understand that. But playing with SEE might allow you to imagine it.',

    CONDITIONS_TITLE: 'Eye conditions',
    RETINITIS_PIGMENTOSA: 'Retinitis pigmentosa',
    RETINITIS_PIGMENTOSA_INFO: 'More information about this condition on <a href="http://en.wikipedia.org/wiki/Retinitis_pigmentosa" target="_blank">WikiPedia</a>',
    DIABETIC_RETINOPATHY: 'Diabetic retinopathy',
    DIABETIC_RETINOPATHY_INFO: 'More information about this condition on <a href="http://en.wikipedia.org/wiki/Diabetic_retinopathy" target="_blank">WikiPedia</a>',
    GLAUCOMA: 'Glaucoma',
    GLAUCOMA_INFO: 'More information about this condition on <a href="http://en.wikipedia.org/wiki/Glaucoma" target="_blank">WikiPedia</a>',
    MACULAR_DEGENERATION: 'Macular degeneration',
    MACULAR_DEGENERATION_INFO: 'More information about this condition on <a href="http://en.wikipedia.org/wiki/Macular_degeneration" target="_blank">WikiPedia</a>',
    CATARACT: 'Cataract',
    CATARACT_INFO: 'More information about this condition on <a href="http://en.wikipedia.org/wiki/Cataract" target="_blank">WikiPedia</a>',

    COLOR_BLINDNESS_TITLE: 'Colour blindness',
    PROTANOMALY: 'Protanomaly',
    PROTANOMALY_INFO: 'More information about this condition on <a href="http://en.wikipedia.org/wiki/Protanomaly#Anomalous_trichromacy" target="_blank">WikiPedia</a>',
    DEUTERANOMALY: 'Deuteranomaly',
    DEUTERANOMALY_INFO: 'More information about this condition on <a href="http://en.wikipedia.org/wiki/Protanomaly#Anomalous_trichromacy" target="_blank">WikiPedia</a>',
    TRITANOMALY: 'Tritanomaly',
    TRITANOMALY_INFO: 'More information about this condition on <a href="http://en.wikipedia.org/wiki/Protanomaly#Anomalous_trichromacy" target="_blank">WikiPedia</a>',
    ACHROMATOPSIA: 'Achromatopsy',
    ACHROMATOPSIA_INFO: 'More information about this condition on <a href="http://en.wikipedia.org/wiki/Protanomaly#Total_color_blindness" target="_blank">WikiPedia</a>',
    
    DEVELOPED_BY: 'This extension was developed by',
    IN_COOP_WITH: 'and'
  },

  // Dutch
  NL: {
    INTRO: '"Hoe is het om slechtziend te zijn?" Als goedziende mens kom je dat nooit helemaal te weten. Maar door te spelen met SEE kun je het je misschien iets beter voorstellen.',

    CONDITIONS_TITLE: 'Oogaandoeningen',

    RETINITIS_PIGMENTOSA: 'Retinitis pigmentosa',
    RETINITIS_PIGMENTOSA_INFO: 'Informatie over deze aandoening op <a href="http://nl.wikipedia.org/wiki/Retinitis_pigmentosa" target="_blank">WikiPedia</a>',
    DIABETIC_RETINOPATHY: 'Diabetische retinopathie',
    DIABETIC_RETINOPATHY_INFO: 'Informatie over deze aandoening op <a href="http://nl.wikipedia.org/wiki/Diabetische_retinopathie" target="_blank">WikiPedia</a>',
    GLAUCOMA: 'Glaucoom',
    GLAUCOMA_INFO: 'Informatie over deze aandoening op <a href="http://nl.wikipedia.org/wiki/Glaucoom" target="_blank">WikiPedia</a>',
    MACULAR_DEGENERATION: 'Maculadegeneratie',
    MACULAR_DEGENERATION_INFO: 'Informatie over deze aandoening op <a href="http://nl.wikipedia.org/wiki/Maculadegeneratie" target="_blank">WikiPedia</a>',
    CATARACT: 'Staar',
    CATARACT_INFO: 'Informatie over deze aandoening op <a href="http://nl.wikipedia.org/wiki/Staar" target="_blank">WikiPedia</a>',

    COLOR_BLINDNESS_TITLE: 'Kleurenblindheid',
    PROTANOMALY: 'Protanomalie',
    PROTANOMALY_INFO: 'Informatie over deze aandoening op <a href="http://nl.wikipedia.org/wiki/Kleurenblindheid" target="_blank">WikiPedia</a>',
    DEUTERANOMALY: 'Deuteranomalie',
    DEUTERANOMALY_INFO: 'Informatie over deze aandoening op <a href="http://nl.wikipedia.org/wiki/Kleurenblindheid" target="_blank">WikiPedia</a>',
    TRITANOMALY: 'Tritanomalie',
    TRITANOMALY_INFO: 'Informatie over deze aandoening op <a href="http://nl.wikipedia.org/wiki/Kleurenblindheid" target="_blank">WikiPedia</a>',
    ACHROMATOPSIA: 'Achromatopsie',
    ACHROMATOPSIA_INFO: 'Informatie over deze aandoening op <a href="http://nl.wikipedia.org/wiki/Kleurenblindheid" target="_blank">WikiPedia</a>',
    
    DEVELOPED_BY: 'Deze extensie is ontwikkeld door',
    IN_COOP_WITH: 'i.s.m.'
  }
};

function setLang(lang) {
  lang=lang.target?lang.target.getAttribute('lang'):lang;
  var LANG = localization[lang] || localization['EN'];
  localStorage.setItem('language',lang);
  $('a.slang').removeClass('selected').filter('[lang='+lang+']').addClass('selected');
  $('[local]').each(function($t){($t=$(this)).html(LANG[$t.attr('local')])});
};

for(var x in localization) $('#lang-select')
  .append('<span class="sep"> | </span>')
  .append($('<a href="#" class="slang" lang="'+x+'">'+x.toLowerCase()+'</a>').click(setLang));

setLang(localStorage.getItem('language')||navigator.language.substr(0,2).toUpperCase());

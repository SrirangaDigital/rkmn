<?php

class viewHelper extends View {

    public $bhashyaDef = array( "BS"=>"BS", "Ka"=>"Kathaka", "MD"=>"Mundaka", "T"=>"Taitiriya", "AI"=>"Aitareya", "BR"=>"Brha", "Ch"=>"Chandogya", "KP"=>"Kena_pada", "KV"=>"Kena_vakya", "PR"=>"Prashna", "MK"=>"Mandukya", "BG"=>"Gita", "SV"=>"svt", "KT"=>"kst", "IS"=>"Isha", "JB"=>"jbl", "SS"=>"shrutisarasamuddharanam", "HA"=>"hastamalakiya-bhashya", "VC"=>"vivekachudamani", "SH"=>"shatashloki", "SV"=>"sarvavedantasiddhantasarasangraha", "RP"=>"ratnaprabha", "PP"=>"panchapadika", "VK"=>"vaktavyakashika", "AG"=>"anandagiri-gita", "TV"=>"taittiriya-vartika", "VN"=>"vaiyasika-nyayamala");
    public $vyakhyaNames = array( "RP"=>"भाष्यरत्नप्रभाव्याख्या", "PP"=>"पञ्चपादिका", "VK"=>"वक्तव्यकाशिका", "AG"=>"आनन्दगिरिटीका", "TV"=>"तैत्तिरीयोपनिषद्भाष्यवार्तिकम्", "VN"=>"वैयासिकन्यायमाला" );

    public function __construct() {


    }

    public function processLinks($text) {

        $text = str_replace('_id.html#', '?id=', $text);
        // $text = preg_replace('/<span class="qt"><a href="(.*?)">(.*?) (\(.*?\))<\/a><\/span>/', '<span class="qt"><a href="' . "$1" . '">' . "$2" . ' ' . "$3" . '</a></span>', $text);

        return $text;
    }

    public function removeSpan($text) {

        $text = str_replace('<span', "\n<span", $text);

        $text = preg_replace("/\n<span id=\".*?\">(.*)<\/span>/m", "$1", $text);
        $text = preg_replace("/\n<span id=\".*?\">(.*)<\/span>/m", "$1", $text);

        $text = str_replace("\n<span", "<span", $text);

        return $text;
    }

    public function highlightText($text = '', $word = '') {

        return preg_replace('/' . $word . '/u', '<span class="highlight">' . $word . '</span>', $text);
    }

    public function printSecondaryNav($bhashya) {

        $details = $this->getBhashyaDetails($bhashya);
        $secondaryNav = (isset($details['secondary-nav'])) ? $details['secondary-nav'] : [];

        $text = '<li class="special first"><a href="#" title="Back to top">ग्रन्थारम्भः</a></li>';

        foreach ($secondaryNav as $name => $link) {

            $text .= '<li class="special"><a target="_blank" href="' . BASE_URL . $link . '">' . $name . '</a></li>';
        }

        return $text;
    }

    public function getBhashyaDetails($bhashya) {

        $details = json_decode(file_get_contents(JSON_PRECAST_URL . 'secondary-nav.json'), true);
        return $details{$bhashya};
    }

    public function printAddress($address, $bhashya) {

        $print = '<span>' . $this->getBhashyadetails($bhashya)['name'] . '</span>';

        $verseNum = intval(preg_replace('/.*V([0-9]+).*/', "$1", $address['id']));
        $address['V'] = (isset($address['V'])) ? $this->convert2devanagari($address['V'] . ' ' . $verseNum) : '';
        $id = $address['id'];
        unset($address['id']);

        foreach ($address as $key => $value) {
            
            $print .= '<span>' . $value . '</span>';
        }

        // If result is from bhashya para, ppaend it to the address
        if(preg_match('/.*_B[0-9]+$/', $id)) $print .= ' - भाष्यम्';

        return $print;
    }

    public function convert2devanagari($text) {

        $text = str_replace(" 0", "", $text);
        $text = str_replace("0", "०", $text);
        $text = str_replace("1", "१", $text);
        $text = str_replace("2", "२", $text);
        $text = str_replace("3", "३", $text);
        $text = str_replace("4", "४", $text);
        $text = str_replace("5", "५", $text);
        $text = str_replace("6", "६", $text);
        $text = str_replace("7", "७", $text);
        $text = str_replace("8", "८", $text);
        $text = str_replace("9", "९", $text);

        $text = str_replace("sutra", "सूत्रम्", $text);
        $text = str_replace("gadya", "श्लोक", $text);
        $text = str_replace("shloka", "श्लोक", $text);
        $text = str_replace("mantra", "मन्त्र", $text);
        $text = str_replace("shanti_mantra", "शान्ति मन्त्र", $text);
        $text = str_replace("kaarika", "कारिका", $text);
        
        return $text;
    }
}

?>

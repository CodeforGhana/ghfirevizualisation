<?php

/**
 * Created by PhpStorm.
 * User: kwabenaboadu
 * Date: 8/7/15
 * Time: 2:22 PM
 */
class FireDataParser
{

    const MAX_COLS = 32;
    static $categories = [
        'no.', 'injury', 'death', 'injury2', 'death2', 'damage', 'salvage', 'domestic',
        'industrial', 'vehicular', 'institutional', 'electrical', 'commercial',
        'bush', 'others'
    ];

    public function readCSV($filepath)
    {
        if (empty($filepath) || !is_file($filepath))
            throw new Exception('A valid file path must be supplied');

        ini_set('auto_detect_line_endings', TRUE);
        $handle = fopen($filepath, 'r');

        $excelData = [];
        $categories = [];
        $region = "";

        while (($lineArray = fgetcsv($handle)) !== FALSE) {
            // Some rows set the name of the region
            if ($this->isRegionNameRow($lineArray[0])) {
                $region = preg_replace("#[0-9\\(\\)]#", "", strtolower($lineArray[0]));
                $excelData[$region] = [];
                continue;
            }
            // skip non-relevant rows
            if ($this->shouldSkipRow($lineArray))
                continue;
            // set the category information for the region
            if ($this->isCategoriesRow($lineArray, self::$categories)) {
                if (count($categories) < 1) {
                    $categories = $this->getCategories();
                }
            }
            // set the month and associated data
            if ($this->isMonthValuesRow($lineArray[0])) {
                $month = strtolower(trim($lineArray[0]));
                $excelData[$region][$month] = [];

                // Looping through the row, set the category values for the month
                for ($j = 1; $j <= count(self::$categories); ++$j) {
                    $catVal = $lineArray[$j];
                    $catIndex = $j - 1;

                    if (array_key_exists($catIndex, $categories))
                        $excelData[$region][$month][$categories[$catIndex]] = $catVal;
                }
                if ($month == 'december')
                    $region = "";
            }
        }
        fclose($handle);
        return $excelData;
    }

    public function writeToFile($data, $filename = 'fireoutbreak.json') {
        return file_put_contents(getcwd() . DIRECTORY_SEPARATOR . 'dataset' . DIRECTORY_SEPARATOR . $filename, $data);
    }

    protected function isRegionNameRow($val)
    {
        $exp = "#^.*(ashanti|volta|accra|tema|western|central|brong|northern|upper east|upper west|eastern|headquarters|fats).*$#i";
        return preg_match($exp, $val);
    }

    protected function shouldSkipRow(array $row)
    {
        $firstElem = strtolower(trim($row[0]));
        return preg_match("(month|%)", $firstElem);
    }

    protected function isCategoriesRow(array $row, array $cats)
    {
        // if at least 3 categories are correctly found, return
        $numMatched = 0;
        foreach ($row as $val) {
            if (in_array(strtolower(trim($val)), $cats))
                ++$numMatched;

            if ($numMatched >= 2)
                return true;
        }
        return false;
    }

    protected function getCategories()
    {
        return self::$categories;
    }

    protected function isMonthValuesRow($val)
    {
        $exp = "#^january|february|march|april|may|june|july|august|september|october|november|december$#";
        return preg_match($exp, strtolower(trim($val)));
    }
}

try {
    $parser = new FireDataParser();
    $data = $parser->readCSV(getcwd() . DIRECTORY_SEPARATOR . "dataset" . DIRECTORY_SEPARATOR . "firedata2011.csv");
    // write the data to a file
    $encoded = json_encode($data, JSON_NUMERIC_CHECK);
    $parser->writeToFile($encoded);
    echo $encoded;
} catch (Exception $e) {
    echo $e->getMessage();
}
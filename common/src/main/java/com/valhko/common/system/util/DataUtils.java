package com.valhko.common.system.util;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

public class DataUtils {
    public static List<String> getCountries() {
        List<String> countries = new ArrayList<>();
        for (String countryCode : Locale.getISOCountries()) {

            Locale obj = Locale.of("", countryCode);

            countries.add(obj.getDisplayCountry());
        }
        return countries;
    }
}

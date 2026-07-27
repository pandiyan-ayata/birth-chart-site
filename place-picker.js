/* Place-of-birth lookup: Tamil Nadu (all 38 districts + many taluk towns)
   plus the major cities of the other South Indian states/UTs.
   tz = standard UTC offset in hours (no daylight saving). */
(function (global) {
  "use strict";

  var CITIES = [
    /* ---- சென்னை மாவட்டம் ---- */
    { ta: "சென்னை", en: "Chennai", lat: 13.0827, lon: 80.2707, tz: 5.5 },

    /* ---- திருவள்ளூர் மாவட்டம் ---- */
    { ta: "திருவள்ளூர்", en: "Tiruvallur", lat: 13.1231, lon: 79.9092, tz: 5.5 },
    { ta: "பொன்னேரி", en: "Ponneri", lat: 13.3333, lon: 80.1833, tz: 5.5 },
    { ta: "கும்மிடிப்பூண்டி", en: "Gummidipoondi", lat: 13.4064, lon: 80.1005, tz: 5.5 },
    { ta: "ஆவடி", en: "Avadi", lat: 13.1147, lon: 80.1000, tz: 5.5 },
    { ta: "பூந்தமல்லி", en: "Poonamallee", lat: 13.0503, lon: 80.0948, tz: 5.5 },
    { ta: "திருத்தணி", en: "Tiruttani", lat: 13.1755, lon: 79.6293, tz: 5.5 },
    { ta: "உத்துக்கோட்டை", en: "Uthukkottai", lat: 13.3667, lon: 79.8667, tz: 5.5 },

    /* ---- காஞ்சிபுரம் மாவட்டம் ---- */
    { ta: "காஞ்சிபுரம்", en: "Kanchipuram", lat: 12.8342, lon: 79.7036, tz: 5.5 },
    { ta: "ஸ்ரீபெரும்புதூர்", en: "Sriperumbudur", lat: 12.9675, lon: 79.9430, tz: 5.5 },
    { ta: "உத்திரமேரூர்", en: "Uthiramerur", lat: 12.6167, lon: 79.7500, tz: 5.5 },
    { ta: "வாலாஜாபாத்", en: "Walajabad", lat: 12.9280, lon: 79.6700, tz: 5.5 },

    /* ---- செங்கல்பட்டு மாவட்டம் ---- */
    { ta: "செங்கல்பட்டு", en: "Chengalpattu", lat: 12.6819, lon: 79.9761, tz: 5.5 },
    { ta: "மாமல்லபுரம்", en: "Mamallapuram", lat: 12.6269, lon: 80.1927, tz: 5.5 },
    { ta: "தாம்பரம்", en: "Tambaram", lat: 12.9249, lon: 80.1000, tz: 5.5 },
    { ta: "மதுராந்தகம்", en: "Madurantakam", lat: 12.5100, lon: 79.8900, tz: 5.5 },
    { ta: "திருப்போரூர்", en: "Tirupporur", lat: 12.7167, lon: 80.2000, tz: 5.5 },
    { ta: "செம்மஞ்சேரி", en: "Semmancheri", lat: 12.8280, lon: 80.2280, tz: 5.5 },

    /* ---- வேலூர் மாவட்டம் ---- */
    { ta: "வேலூர்", en: "Vellore", lat: 12.9165, lon: 79.1325, tz: 5.5 },
    { ta: "காட்பாடி", en: "Katpadi", lat: 12.9700, lon: 79.1500, tz: 5.5 },
    { ta: "கீழ்பென்னாத்தூர்", en: "Gudiyatham", lat: 12.9450, lon: 78.8700, tz: 5.5 },

    /* ---- ராணிப்பேட்டை மாவட்டம் ---- */
    { ta: "ராணிப்பேட்டை", en: "Ranipet", lat: 12.9249, lon: 79.3308, tz: 5.5 },
    { ta: "ஆற்காடு", en: "Arcot", lat: 12.9051, lon: 79.3200, tz: 5.5 },
    { ta: "வாலாஜாபேட்டை", en: "Walajapet", lat: 12.9310, lon: 79.3630, tz: 5.5 },
    { ta: "ஆற்காடு (செருக்காயூர்)", en: "Sholingur", lat: 13.1200, lon: 79.4200, tz: 5.5 },

    /* ---- திருப்பத்தூர் மாவட்டம் ---- */
    { ta: "திருப்பத்தூர்", en: "Tirupathur", lat: 12.4950, lon: 78.5730, tz: 5.5 },
    { ta: "வாணியம்பாடி", en: "Vaniyambadi", lat: 12.6833, lon: 78.6167, tz: 5.5 },
    { ta: "ஆம்பூர்", en: "Ambur", lat: 12.7900, lon: 78.7167, tz: 5.5 },
    { ta: "ஜோலார்பேட்டை", en: "Jolarpettai", lat: 12.5750, lon: 78.5750, tz: 5.5 },

    /* ---- கிருஷ்ணகிரி மாவட்டம் ---- */
    { ta: "கிருஷ்ணகிரி", en: "Krishnagiri", lat: 12.5186, lon: 78.2137, tz: 5.5 },
    { ta: "ஓசூர்", en: "Hosur", lat: 12.7409, lon: 77.8253, tz: 5.5 },
    { ta: "டெங்காநிக்கோட்டை", en: "Denkanikottai", lat: 12.5333, lon: 77.7833, tz: 5.5 },
    { ta: "பர்கூர்", en: "Bargur", lat: 12.4980, lon: 78.1800, tz: 5.5 },

    /* ---- தர்மபுரி மாவட்டம் ---- */
    { ta: "தர்மபுரி", en: "Dharmapuri", lat: 12.1211, lon: 78.1582, tz: 5.5 },
    { ta: "பாலக்கோடு", en: "Palacode", lat: 12.3667, lon: 78.0667, tz: 5.5 },
    { ta: "பென்னாகரம்", en: "Pennagaram", lat: 12.2333, lon: 77.8000, tz: 5.5 },
    { ta: "ஹரூர்", en: "Harur", lat: 12.0500, lon: 78.4833, tz: 5.5 },

    /* ---- சேலம் மாவட்டம் ---- */
    { ta: "சேலம்", en: "Salem", lat: 11.6643, lon: 78.1460, tz: 5.5 },
    { ta: "ஆத்தூர்", en: "Attur", lat: 11.5900, lon: 78.6000, tz: 5.5 },
    { ta: "மேட்டூர்", en: "Mettur", lat: 11.7900, lon: 77.8000, tz: 5.5 },
    { ta: "ஓமலூர்", en: "Omalur", lat: 11.7500, lon: 78.0500, tz: 5.5 },
    { ta: "எடப்பாடி", en: "Edappadi", lat: 11.5833, lon: 77.8500, tz: 5.5 },

    /* ---- நாமக்கல் மாவட்டம் ---- */
    { ta: "நாமக்கல்", en: "Namakkal", lat: 11.2189, lon: 78.1677, tz: 5.5 },
    { ta: "இராசிபுரம்", en: "Rasipuram", lat: 11.4500, lon: 78.1833, tz: 5.5 },
    { ta: "திருச்செங்கோடு", en: "Tiruchengode", lat: 11.3800, lon: 77.8900, tz: 5.5 },
    { ta: "பரமத்தி வேலூர்", en: "Paramathi Velur", lat: 11.3833, lon: 78.1667, tz: 5.5 },

    /* ---- ஈரோடு மாவட்டம் ---- */
    { ta: "ஈரோடு", en: "Erode", lat: 11.3410, lon: 77.7172, tz: 5.5 },
    { ta: "கோபிசெட்டிபாளையம்", en: "Gobichettipalayam", lat: 11.4550, lon: 77.4400, tz: 5.5 },
    { ta: "பவானி", en: "Bhavani", lat: 11.4460, lon: 77.6800, tz: 5.5 },
    { ta: "சத்தியமங்கலம்", en: "Sathyamangalam", lat: 11.5041, lon: 77.2380, tz: 5.5 },
    { ta: "பெருந்துறை", en: "Perundurai", lat: 11.2760, lon: 77.5820, tz: 5.5 },

    /* ---- நீலகிரி மாவட்டம் ---- */
    { ta: "உதகமண்டலம் (ஊட்டி)", en: "Udhagamandalam (Ooty)", lat: 11.4064, lon: 76.6932, tz: 5.5 },
    { ta: "குன்னூர்", en: "Coonoor", lat: 11.3530, lon: 76.7950, tz: 5.5 },
    { ta: "குடலூர் (நீலகிரி)", en: "Gudalur", lat: 11.5000, lon: 76.4833, tz: 5.5 },

    /* ---- கோயம்புத்தூர் மாவட்டம் ---- */
    { ta: "கோயம்புத்தூர்", en: "Coimbatore", lat: 11.0168, lon: 76.9558, tz: 5.5 },
    { ta: "பொள்ளாச்சி", en: "Pollachi", lat: 10.6588, lon: 77.0083, tz: 5.5 },
    { ta: "மேட்டுப்பாளையம்", en: "Mettupalayam", lat: 11.2996, lon: 76.9410, tz: 5.5 },
    { ta: "வால்பாறை", en: "Valparai", lat: 10.3273, lon: 76.9550, tz: 5.5 },
    { ta: "சூலூர்", en: "Sulur", lat: 11.0270, lon: 77.1250, tz: 5.5 },

    /* ---- திருப்பூர் மாவட்டம் ---- */
    { ta: "திருப்பூர்", en: "Tiruppur", lat: 11.1085, lon: 77.3411, tz: 5.5 },
    { ta: "பல்லடம்", en: "Palladam", lat: 11.0300, lon: 77.2900, tz: 5.5 },
    { ta: "உடுமலைப்பேட்டை", en: "Udumalaipettai", lat: 10.5900, lon: 77.2500, tz: 5.5 },
    { ta: "அவிநாசி", en: "Avinashi", lat: 11.1930, lon: 77.2680, tz: 5.5 },
    { ta: "தாராபுரம்", en: "Dharapuram", lat: 10.7333, lon: 77.5333, tz: 5.5 },

    /* ---- கரூர் மாவட்டம் ---- */
    { ta: "கரூர்", en: "Karur", lat: 10.9601, lon: 78.0766, tz: 5.5 },
    { ta: "குளித்தலை", en: "Kulithalai", lat: 10.9333, lon: 78.4167, tz: 5.5 },
    { ta: "அறவக்குறிச்சி", en: "Aravakurichi", lat: 10.8667, lon: 78.0333, tz: 5.5 },

    /* ---- திருச்சிராப்பள்ளி மாவட்டம் ---- */
    { ta: "திருச்சிராப்பள்ளி", en: "Tiruchirappalli", lat: 10.7905, lon: 78.7047, tz: 5.5 },
    { ta: "ஸ்ரீரங்கம்", en: "Srirangam", lat: 10.8624, lon: 78.6928, tz: 5.5 },
    { ta: "லால்குடி", en: "Lalgudi", lat: 10.8700, lon: 78.8300, tz: 5.5 },
    { ta: "மணப்பாறை", en: "Manapparai", lat: 10.5980, lon: 78.4260, tz: 5.5 },
    { ta: "முசிறி", en: "Musiri", lat: 10.9500, lon: 78.4500, tz: 5.5 },
    { ta: "தொட்டியம்", en: "Thottiyam", lat: 11.0700, lon: 78.4800, tz: 5.5 },

    /* ---- பெரம்பலூர் மாவட்டம் ---- */
    { ta: "பெரம்பலூர்", en: "Perambalur", lat: 11.2333, lon: 78.8833, tz: 5.5 },
    { ta: "குன்னம்", en: "Kunnam", lat: 11.2000, lon: 78.9500, tz: 5.5 },
    { ta: "வெப்பஞ்சேரி", en: "Veppanthattai", lat: 11.1333, lon: 78.7500, tz: 5.5 },

    /* ---- அரியலூர் மாவட்டம் ---- */
    { ta: "அரியலூர்", en: "Ariyalur", lat: 11.1401, lon: 79.0782, tz: 5.5 },
    { ta: "ஜெயங்கொண்டம்", en: "Jayankondam", lat: 11.2333, lon: 79.3667, tz: 5.5 },
    { ta: "உடையார்பாளையம்", en: "Udayarpalayam", lat: 11.2200, lon: 79.1500, tz: 5.5 },

    /* ---- புதுக்கோட்டை மாவட்டம் ---- */
    { ta: "புதுக்கோட்டை", en: "Pudukkottai", lat: 10.3833, lon: 78.8000, tz: 5.5 },
    { ta: "அரந்தாங்கி", en: "Aranthangi", lat: 10.1667, lon: 79.0333, tz: 5.5 },
    { ta: "கரம்பக்குடி", en: "Karambakkudi", lat: 10.4000, lon: 78.9500, tz: 5.5 },
    { ta: "இளையான்குடி", en: "Illupur", lat: 10.3300, lon: 78.6100, tz: 5.5 },

    /* ---- தஞ்சாவூர் மாவட்டம் ---- */
    { ta: "தஞ்சாவூர்", en: "Thanjavur", lat: 10.7870, lon: 79.1378, tz: 5.5 },
    { ta: "கும்பகோணம்", en: "Kumbakonam", lat: 10.9601, lon: 79.3788, tz: 5.5 },
    { ta: "பட்டுக்கோட்டை", en: "Pattukkottai", lat: 10.4300, lon: 79.3200, tz: 5.5 },
    { ta: "பாபநாசம்", en: "Papanasam", lat: 10.9167, lon: 79.2667, tz: 5.5 },
    { ta: "திருவையாறு", en: "Thiruvaiyaru", lat: 10.8600, lon: 79.0800, tz: 5.5 },
    { ta: "ஒரத்தநாடு", en: "Orathanadu", lat: 10.6667, lon: 79.2500, tz: 5.5 },

    /* ---- திருவாரூர் மாவட்டம் ---- */
    { ta: "திருவாரூர்", en: "Tiruvarur", lat: 10.7661, lon: 79.6345, tz: 5.5 },
    { ta: "மன்னார்குடி", en: "Mannargudi", lat: 10.6667, lon: 79.4500, tz: 5.5 },
    { ta: "நன்னிலம்", en: "Nannilam", lat: 10.9000, lon: 79.5333, tz: 5.5 },
    { ta: "கூத்தநல்லூர்", en: "Kuthalam", lat: 11.0100, lon: 79.5300, tz: 5.5 },

    /* ---- நாகப்பட்டினம் மாவட்டம் ---- */
    { ta: "நாகப்பட்டினம்", en: "Nagapattinam", lat: 10.7672, lon: 79.8449, tz: 5.5 },
    { ta: "வேதாரண்யம்", en: "Vedaranyam", lat: 10.3667, lon: 79.8500, tz: 5.5 },
    { ta: "திருத்துறைப்பூண்டி", en: "Thirutturaipoondi", lat: 10.5500, lon: 79.6333, tz: 5.5 },
    { ta: "கீழையூர்", en: "Kilvelur", lat: 10.7500, lon: 79.7333, tz: 5.5 },

    /* ---- மயிலாடுதுறை மாவட்டம் ---- */
    { ta: "மயிலாடுதுறை", en: "Mayiladuthurai", lat: 11.1039, lon: 79.6520, tz: 5.5 },
    { ta: "தரங்கம்பாடி", en: "Tharangambadi", lat: 11.0300, lon: 79.8500, tz: 5.5 },
    { ta: "சீர்காழி", en: "Sirkazhi", lat: 11.2333, lon: 79.7333, tz: 5.5 },
    { ta: "குத்தாலம்", en: "Kuttalam", lat: 11.0700, lon: 79.5700, tz: 5.5 },

    /* ---- கடலூர் மாவட்டம் ---- */
    { ta: "கடலூர்", en: "Cuddalore", lat: 11.7480, lon: 79.7714, tz: 5.5 },
    { ta: "சிதம்பரம்", en: "Chidambaram", lat: 11.3994, lon: 79.6900, tz: 5.5 },
    { ta: "பண்ருட்டி", en: "Panruti", lat: 11.7700, lon: 79.5500, tz: 5.5 },
    { ta: "விருத்தாசலம்", en: "Vriddhachalam", lat: 11.5000, lon: 79.3200, tz: 5.5 },
    { ta: "நெய்வேலி", en: "Neyveli", lat: 11.6090, lon: 79.4820, tz: 5.5 },
    { ta: "பொன்னேரி (கடலூர்)", en: "Kurinjipadi", lat: 11.6667, lon: 79.6167, tz: 5.5 },

    /* ---- கள்ளக்குறிச்சி மாவட்டம் ---- */
    { ta: "கள்ளக்குறிச்சி", en: "Kallakurichi", lat: 11.7400, lon: 78.9600, tz: 5.5 },
    { ta: "உளுந்தூர்பேட்டை", en: "Ulundurpet", lat: 11.6900, lon: 79.2500, tz: 5.5 },
    { ta: "சங்கராபுரம்", en: "Sankarapuram", lat: 11.8300, lon: 78.8500, tz: 5.5 },

    /* ---- விழுப்புரம் மாவட்டம் ---- */
    { ta: "விழுப்புரம்", en: "Villupuram", lat: 11.9401, lon: 79.4861, tz: 5.5 },
    { ta: "திண்டிவனம்", en: "Tindivanam", lat: 12.2333, lon: 79.6500, tz: 5.5 },
    { ta: "செஞ்சி", en: "Gingee", lat: 12.2500, lon: 79.4167, tz: 5.5 },
    { ta: "வானூர்", en: "Vanur", lat: 11.9700, lon: 79.5900, tz: 5.5 },

    /* ---- திருவண்ணாமலை மாவட்டம் ---- */
    { ta: "திருவண்ணாமலை", en: "Tiruvannamalai", lat: 12.2253, lon: 79.0747, tz: 5.5 },
    { ta: "ஆரணி", en: "Arani", lat: 12.6667, lon: 79.2833, tz: 5.5 },
    { ta: "போளூர்", en: "Polur", lat: 12.5000, lon: 79.1333, tz: 5.5 },
    { ta: "செய்யாறு", en: "Cheyyar", lat: 12.6667, lon: 79.5333, tz: 5.5 },
    { ta: "வந்தவாசி", en: "Vandavasi", lat: 12.5000, lon: 79.6167, tz: 5.5 },

    /* ---- திண்டுக்கல் மாவட்டம் ---- */
    { ta: "திண்டுக்கல்", en: "Dindigul", lat: 10.3673, lon: 77.9803, tz: 5.5 },
    { ta: "பழனி", en: "Palani", lat: 10.4500, lon: 77.5167, tz: 5.5 },
    { ta: "கொடைக்கானல்", en: "Kodaikanal", lat: 10.2381, lon: 77.4892, tz: 5.5 },
    { ta: "ஒட்டன்சத்திரம்", en: "Oddanchatram", lat: 10.4833, lon: 77.7500, tz: 5.5 },
    { ta: "நத்தம்", en: "Natham", lat: 10.2333, lon: 78.1167, tz: 5.5 },

    /* ---- மதுரை மாவட்டம் ---- */
    { ta: "மதுரை", en: "Madurai", lat: 9.9252, lon: 78.1198, tz: 5.5 },
    { ta: "மேலூர்", en: "Melur", lat: 10.0333, lon: 78.3333, tz: 5.5 },
    { ta: "உசிலம்பட்டி", en: "Usilampatti", lat: 9.9667, lon: 77.7833, tz: 5.5 },
    { ta: "திருமங்கலம்", en: "Tirumangalam", lat: 9.8250, lon: 77.9950, tz: 5.5 },
    { ta: "வாடிப்பட்டி", en: "Vadipatti", lat: 9.9950, lon: 77.9500, tz: 5.5 },

    /* ---- தேனி மாவட்டம் ---- */
    { ta: "தேனி", en: "Theni", lat: 10.0104, lon: 77.4768, tz: 5.5 },
    { ta: "பெரியகுளம்", en: "Periyakulam", lat: 10.1233, lon: 77.5460, tz: 5.5 },
    { ta: "போடிநாயக்கனூர்", en: "Bodinayakanur", lat: 10.0100, lon: 77.3500, tz: 5.5 },
    { ta: "கம்பம்", en: "Cumbum", lat: 9.7333, lon: 77.2833, tz: 5.5 },
    { ta: "ஆண்டிப்பட்டி", en: "Andipatti", lat: 9.9333, lon: 77.6167, tz: 5.5 },

    /* ---- சிவகங்கை மாவட்டம் ---- */
    { ta: "சிவகங்கை", en: "Sivaganga", lat: 9.8438, lon: 78.4809, tz: 5.5 },
    { ta: "காரைக்குடி", en: "Karaikudi", lat: 10.0730, lon: 78.7730, tz: 5.5 },
    { ta: "மானாமதுரை", en: "Manamadurai", lat: 9.7000, lon: 78.4333, tz: 5.5 },
    { ta: "இலட்சுமணப்பேட்டை", en: "Devakottai", lat: 9.9500, lon: 78.8000, tz: 5.5 },

    /* ---- இராமநாதபுரம் மாவட்டம் ---- */
    { ta: "இராமநாதபுரம்", en: "Ramanathapuram", lat: 9.3639, lon: 78.8395, tz: 5.5 },
    { ta: "இராமேஸ்வரம்", en: "Rameswaram", lat: 9.2876, lon: 79.3129, tz: 5.5 },
    { ta: "பரமக்குடி", en: "Paramakudi", lat: 9.5500, lon: 78.5833, tz: 5.5 },
    { ta: "முதுகுளத்தூர்", en: "Mudukulathur", lat: 9.3833, lon: 78.5167, tz: 5.5 },

    /* ---- விருதுநகர் மாவட்டம் ---- */
    { ta: "விருதுநகர்", en: "Virudhunagar", lat: 9.5851, lon: 77.9624, tz: 5.5 },
    { ta: "சிவகாசி", en: "Sivakasi", lat: 9.4520, lon: 77.7980, tz: 5.5 },
    { ta: "இராஜபாளையம்", en: "Rajapalayam", lat: 9.4517, lon: 77.5540, tz: 5.5 },
    { ta: "ஸ்ரீவில்லிபுத்தூர்", en: "Srivilliputhur", lat: 9.5133, lon: 77.6330, tz: 5.5 },
    { ta: "அருப்புக்கோட்டை", en: "Aruppukkottai", lat: 9.5060, lon: 78.0970, tz: 5.5 },

    /* ---- தென்காசி மாவட்டம் ---- */
    { ta: "தென்காசி", en: "Tenkasi", lat: 8.9600, lon: 77.3160, tz: 5.5 },
    { ta: "செங்கோட்டை", en: "Shencottai", lat: 8.9750, lon: 77.2450, tz: 5.5 },
    { ta: "சங்கரன்கோவில்", en: "Sankarankovil", lat: 9.1667, lon: 77.5333, tz: 5.5 },
    { ta: "குற்றாலம்", en: "Courtallam", lat: 8.9333, lon: 77.2667, tz: 5.5 },

    /* ---- திருநெல்வேலி மாவட்டம் ---- */
    { ta: "திருநெல்வேலி", en: "Tirunelveli", lat: 8.7139, lon: 77.7567, tz: 5.5 },
    { ta: "அம்பாசமுத்திரம்", en: "Ambasamudram", lat: 8.7000, lon: 77.4667, tz: 5.5 },
    { ta: "பாளையங்கோட்டை", en: "Palayamkottai", lat: 8.7167, lon: 77.7333, tz: 5.5 },
    { ta: "நாங்குநேரி", en: "Nanguneri", lat: 8.4900, lon: 77.6600, tz: 5.5 },

    /* ---- தூத்துக்குடி மாவட்டம் ---- */
    { ta: "தூத்துக்குடி", en: "Thoothukudi", lat: 8.7642, lon: 78.1348, tz: 5.5 },
    { ta: "கோவில்பட்டி", en: "Kovilpatti", lat: 9.1700, lon: 77.8700, tz: 5.5 },
    { ta: "திருச்செந்தூர்", en: "Tiruchendur", lat: 8.4970, lon: 78.1230, tz: 5.5 },
    { ta: "விளாத்திகுளம்", en: "Vilathikulam", lat: 9.0500, lon: 78.1667, tz: 5.5 },
    { ta: "ஸ்ரீவைகுண்டம்", en: "Srivaikuntam", lat: 8.6270, lon: 77.9210, tz: 5.5 },

    /* ---- கன்னியாகுமரி மாவட்டம் ---- */
    { ta: "நாகர்கோவில்", en: "Nagercoil", lat: 8.1780, lon: 77.4340, tz: 5.5 },
    { ta: "கன்னியாகுமரி", en: "Kanyakumari", lat: 8.0883, lon: 77.5385, tz: 5.5 },
    { ta: "கொளச்சல்", en: "Colachel", lat: 8.1770, lon: 77.2540, tz: 5.5 },
    { ta: "மார்த்தாண்டம்", en: "Marthandam", lat: 8.3000, lon: 77.2000, tz: 5.5 },
    { ta: "பத்மநாபபுரம்", en: "Padmanabhapuram", lat: 8.2440, lon: 77.3320, tz: 5.5 },

    /* ---- புதுச்சேரி ஒன்றிய பிரதேசம் ---- */
    { ta: "புதுச்சேரி", en: "Puducherry", lat: 11.9416, lon: 79.8083, tz: 5.5 },
    { ta: "காரைக்கால்", en: "Karaikal", lat: 10.9254, lon: 79.8380, tz: 5.5 },
    { ta: "மாஹே", en: "Mahe", lat: 11.7000, lon: 75.5330, tz: 5.5 },
    { ta: "யானம்", en: "Yanam", lat: 16.7333, lon: 82.2167, tz: 5.5 },

    /* ---- ஆந்திரப் பிரதேசம் / தெலுங்கானா ---- */
    { ta: "திருப்பதி", en: "Tirupati", lat: 13.6288, lon: 79.4192, tz: 5.5 },
    { ta: "விஜயவாடா", en: "Vijayawada", lat: 16.5062, lon: 80.6480, tz: 5.5 },
    { ta: "விசாகப்பட்டினம்", en: "Visakhapatnam", lat: 17.6868, lon: 83.2185, tz: 5.5 },
    { ta: "நெல்லூர்", en: "Nellore", lat: 14.4426, lon: 79.9865, tz: 5.5 },
    { ta: "குண்டூர்", en: "Guntur", lat: 16.3067, lon: 80.4365, tz: 5.5 },
    { ta: "சித்தூர்", en: "Chittoor", lat: 13.2172, lon: 79.1003, tz: 5.5 },
    { ta: "ஹைதராபாத்", en: "Hyderabad", lat: 17.3850, lon: 78.4867, tz: 5.5 },
    { ta: "வாரங்கல்", en: "Warangal", lat: 17.9689, lon: 79.5941, tz: 5.5 },

    /* ---- கர்நாடகா ---- */
    { ta: "பெங்களூரு", en: "Bengaluru", lat: 12.9716, lon: 77.5946, tz: 5.5 },
    { ta: "மைசூரு", en: "Mysuru", lat: 12.2958, lon: 76.6394, tz: 5.5 },
    { ta: "மங்களூரு", en: "Mangaluru", lat: 12.9141, lon: 74.8560, tz: 5.5 },
    { ta: "ஹொசூர் அருகே கோலார்", en: "Kolar", lat: 13.1367, lon: 78.1291, tz: 5.5 },
    { ta: "சேலம் அருகே தர்மாபுரி (கர்நாடகா) பாவாகடா", en: "Bagepalli", lat: 13.7900, lon: 77.7900, tz: 5.5 },
    { ta: "ஊட்டி அருகே கூர்க் (மடிக்கேரி)", en: "Madikeri", lat: 12.4244, lon: 75.7382, tz: 5.5 },
    { ta: "பெங்களூரு அருகே ஹொசூர் சாலை (அனேகல்)", en: "Anekal", lat: 12.7100, lon: 77.6960, tz: 5.5 },

    /* ---- கேரளா ---- */
    { ta: "திருவனந்தபுரம்", en: "Thiruvananthapuram", lat: 8.5241, lon: 76.9366, tz: 5.5 },
    { ta: "கொச்சி", en: "Kochi", lat: 9.9312, lon: 76.2673, tz: 5.5 },
    { ta: "கோழிக்கோடு", en: "Kozhikode", lat: 11.2588, lon: 75.7804, tz: 5.5 },
    { ta: "கொல்லம்", en: "Kollam", lat: 8.8932, lon: 76.6141, tz: 5.5 },
    { ta: "திருச்சூர்", en: "Thrissur", lat: 10.5276, lon: 76.2144, tz: 5.5 },
    { ta: "கோட்டயம்", en: "Kottayam", lat: 9.5916, lon: 76.5222, tz: 5.5 },
    { ta: "பாலக்காடு", en: "Palakkad", lat: 10.7867, lon: 76.6548, tz: 5.5 },
    { ta: "கண்ணூர்", en: "Kannur", lat: 11.8745, lon: 75.3704, tz: 5.5 }
  ];

  global.CITY_LIST = CITIES;
})(window);

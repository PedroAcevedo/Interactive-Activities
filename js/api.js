var API = 'http://127.0.0.1:8000/';  //'' // https://apiavas.dcm-system.co/public/

var badges = {
    '1': {
        name: '¡Has recibido una insignia!',
        description: 'Entregada por la realización de los módulos de la App.',
        svg: `<svg width="80px" height="80px"  version="1.0" xmlns="http://www.w3.org/2000/svg" fill=""  
        width="150.000000pt" height="153.000000pt" viewBox="0 0 150.000000 153.000000"
        preserveAspectRatio="xMidYMid meet">
       
       <g transform="translate(0.000000,153.000000) scale(0.100000,-0.100000)"
        stroke="none">
       <path d="M456 1274 c-21 -21 -20 -36 4 -67 28 -35 25 -44 -12 -52 -18 -4 -48
       -16 -67 -26 -40 -24 -61 -12 -61 33 0 57 -81 54 -88 -4 -4 -30 13 -45 53 -50
       35 -4 36 -15 8 -95 -14 -43 -22 -53 -40 -53 -13 0 -23 4 -23 10 0 16 -46 23
       -69 10 -23 -12 -28 -49 -9 -68 17 -17 63 -15 78 3 7 8 25 15 41 15 23 0 29 4
       29 23 1 33 34 99 66 129 107 100 292 34 311 -111 5 -37 8 -41 35 -41 16 0 36
       -7 44 -15 26 -26 60 -19 74 15 10 24 10 33 0 45 -16 20 -54 19 -74 -1 -24 -24
       -49 -13 -58 25 -5 18 -16 44 -25 57 -20 32 -10 54 25 54 34 0 52 16 52 46 0
       20 -32 54 -52 54 -15 0 -38 -33 -38 -54 0 -40 -23 -50 -62 -26 -18 11 -40 20
       -49 20 -8 0 -24 6 -34 14 -18 13 -18 14 3 41 12 15 22 34 22 41 0 19 -29 44
       -50 44 -10 0 -26 -7 -34 -16z"/>
       <path d="M429 1035 c-24 -13 -59 -77 -59 -106 0 -27 35 -81 61 -94 15 -8 47
       -15 70 -15 33 0 47 6 75 34 29 29 34 41 34 81 0 40 -5 52 -34 81 -28 28 -41
       34 -77 34 -24 -1 -56 -7 -70 -15z m117 -39 c21 -18 28 -32 28 -61 0 -86 -118
       -116 -153 -38 -18 39 -13 63 18 94 36 35 70 37 107 5z"/>
       <path d="M840 785 c-15 -8 -36 -36 -50 -67 -13 -29 -26 -55 -27 -57 -2 -2 -28
       23 -58 57 -31 33 -64 63 -73 66 -10 3 -35 -3 -57 -14 -49 -25 -119 -25 -165
       -1 -25 14 -40 16 -55 9 -22 -10 -133 -197 -142 -240 -5 -24 3 -32 78 -87 89
       -65 130 -77 149 -42 20 39 12 70 -25 93 -19 13 -35 28 -35 33 0 6 15 27 33 48
       l32 39 70 -43 c76 -46 87 -57 80 -78 -9 -24 -116 -190 -131 -202 -11 -9 -26
       -4 -70 21 l-57 32 6 -35 c8 -49 50 -112 95 -142 84 -55 105 -58 525 -62 213
       -3 387 -2 387 1 0 14 -162 206 -175 206 -7 0 -31 -20 -53 -45 l-39 -44 -74
       107 c-99 142 -99 142 -202 -5 -69 -100 -82 -113 -107 -113 -19 0 -33 7 -40 19
       -14 27 -14 331 1 331 5 0 27 -11 47 -25 40 -28 70 -32 93 -12 22 17 106 157
       114 187 8 35 -10 80 -32 80 -10 -1 -29 -7 -43 -15z"/>
       <path d="M1237 549 c-39 -23 -41 -86 -3 -111 36 -25 106 9 106 51 0 45 -65 83
       -103 60z"/>
       </g>
       </svg>
       `
    },
    '2': {
        name: '¡Has recibido una insignia!',
        description: 'Entregada por la realización de las actividades de aprendizaje App.',
        svg: `<svg width="80px" height="80px" version="1.0" xmlns="http://www.w3.org/2000/svg" fill=""  
        width="150.000000pt" height="153.000000pt" viewBox="0 0 150.000000 153.000000"
        preserveAspectRatio="xMidYMid meet">
       
       <g transform="translate(0.000000,153.000000) scale(0.100000,-0.100000)"
        stroke="none">
       <path d="M718 1388 l-3 -23 -323 -3 -323 -2 3 -58 3 -57 593 -3 c530 -2 593
       -1 590 13 -3 14 -70 16 -578 18 l-575 2 -3 28 -3 27 636 0 636 0 -3 -27 c-2
       -20 -9 -29 -25 -31 l-23 -3 0 -400 c0 -384 -1 -400 -20 -419 -11 -11 -30 -22
       -42 -25 -13 -3 -258 -4 -544 -3 -496 3 -523 4 -543 22 -20 18 -21 28 -23 375
       -3 309 -5 356 -18 356 -13 0 -15 -46 -15 -355 0 -277 3 -360 13 -378 29 -51
       42 -52 599 -52 319 0 532 4 554 10 70 20 69 14 69 449 l0 390 23 3 c19 3 22
       10 25 61 l3 57 -321 0 -320 0 -10 25 c-12 31 -28 32 -32 3z"/>
       <path d="M436 1144 c-34 -33 -11 -84 38 -84 20 0 40 -8 51 -19 16 -19 16 -21
       -4 -50 -12 -17 -27 -53 -34 -81 -10 -44 -15 -50 -37 -50 -14 0 -33 9 -43 20
       -37 44 -110 6 -91 -48 8 -22 16 -28 46 -30 29 -2 39 1 48 17 7 13 21 21 38 21
       25 0 28 -5 39 -50 7 -28 22 -65 34 -82 28 -38 16 -62 -32 -66 -59 -6 -85 -46
       -56 -86 30 -41 105 -9 93 40 -6 24 37 73 49 55 11 -19 79 -49 126 -56 54 -8
       120 7 170 40 l37 24 18 -21 c11 -11 18 -30 16 -42 -7 -50 65 -81 95 -40 30 41
       4 84 -51 84 -54 0 -64 22 -33 78 14 26 28 64 32 85 6 32 11 37 36 37 18 0 32
       -7 39 -20 21 -39 100 -14 100 32 0 43 -80 65 -100 28 -7 -13 -21 -20 -39 -20
       -25 0 -30 5 -36 38 -4 20 -18 58 -32 84 -30 56 -21 78 32 78 45 0 72 31 59 68
       -8 22 -16 28 -46 30 -29 2 -39 -1 -48 -18 -6 -11 -10 -29 -8 -39 2 -11 -5 -28
       -16 -39 l-18 -21 -37 24 c-81 54 -196 53 -277 -2 -35 -23 -37 -23 -56 -6 -12
       11 -17 25 -14 38 12 49 -52 85 -88 49z m284 -129 c0 -46 -3 -55 -18 -55 -10 0
       -26 6 -35 13 -16 11 -15 15 9 55 14 23 29 42 35 42 5 0 9 -25 9 -55z m68 15
       c28 -42 28 -58 -2 -66 -37 -9 -46 2 -46 57 0 59 12 61 48 9z m-118 25 c0 -18
       -33 -65 -45 -65 -27 0 -28 23 -1 47 26 22 46 30 46 18z m176 -17 l37 -22 -23
       -18 c-13 -10 -24 -17 -25 -16 -24 37 -42 78 -35 78 5 0 25 -10 46 -22z m78
       -92 c9 -19 16 -46 16 -60 0 -23 -4 -26 -38 -26 -37 0 -37 1 -49 51 -12 48 -11
       52 10 69 26 21 38 15 61 -34z m-313 31 c14 -11 15 -20 6 -65 l-11 -52 -44 0
       c-36 0 -43 3 -38 16 3 9 6 23 6 32 0 24 37 82 52 82 7 0 20 -6 29 -13z m106
       -37 c2 0 3 -18 3 -40 l0 -40 -45 0 c-44 0 -45 1 -45 31 0 17 4 39 10 49 8 16
       15 17 42 9 18 -5 34 -9 35 -9z m113 -5 c5 -14 13 -37 16 -51 6 -25 6 -25 -47
       -22 l-54 3 -3 36 c-3 35 -1 37 35 47 21 5 39 10 41 11 1 1 7 -10 12 -24z
       m-217 -127 c4 -18 9 -42 12 -54 8 -25 -39 -52 -60 -34 -12 10 -45 92 -45 112
       0 4 20 8 44 8 41 0 44 -2 49 -32z m107 -7 c0 -37 -2 -39 -36 -46 -20 -3 -38
       -4 -41 -1 -3 2 -7 23 -10 45 l-6 41 47 0 46 0 0 -39z m130 32 c0 -5 -5 -25
       -11 -45 -11 -41 -26 -46 -73 -28 -21 8 -26 16 -26 45 l0 35 55 0 c30 0 55 -3
       55 -7z m90 -18 c0 -30 -23 -90 -39 -99 -6 -4 -22 0 -35 9 -21 14 -23 20 -15
       41 5 14 9 36 9 50 0 21 4 24 40 24 36 0 40 -2 40 -25z m-220 -130 c0 -30 -4
       -55 -10 -55 -5 0 -21 22 -35 49 -22 45 -23 50 -7 54 48 13 52 10 52 -48z m98
       40 c7 -7 -51 -90 -63 -90 -6 0 -11 24 -13 54 l-3 54 37 -6 c20 -3 39 -9 42
       -12z m46 -18 c18 -13 17 -15 -9 -35 -43 -34 -58 -29 -38 13 19 39 22 41 47 22z
       m-209 -27 c12 -23 13 -30 2 -30 -10 0 -44 19 -67 37 -6 5 22 23 37 23 7 0 19
       -13 28 -30z"/>
       <path d="M720 295 c0 -30 -11 -45 -81 -116 -61 -60 -78 -84 -70 -92 8 -8 33
       10 96 73 80 80 85 87 85 127 0 32 -4 43 -15 43 -10 0 -15 -11 -15 -35z"/>
       <path d="M790 187 c0 -21 97 -110 110 -102 8 5 -5 25 -41 61 -55 55 -69 64
       -69 41z"/>
       </g>
       </svg>
       `
    },
    '3': {
        name: '¡Has recibido una insignia!',
        description: 'Entregada por participar y conseguir metas dentro de la App.',
        svg: `<svg width="80px" height="80px" version="1.0" xmlns="http://www.w3.org/2000/svg" fill=""  
        width="150.000000pt" height="153.000000pt" viewBox="0 0 150.000000 153.000000"
        preserveAspectRatio="xMidYMid meet">
       
       <g transform="translate(0.000000,153.000000) scale(0.100000,-0.100000)"
        stroke="none">
       <path d="M553 1445 c-17 -7 -36 -22 -42 -34 -16 -29 -13 -93 5 -120 13 -17 14
       -25 4 -34 -9 -9 -16 -7 -30 11 -10 12 -20 27 -22 33 -10 31 -73 -41 -80 -91
       -3 -24 0 -25 62 -31 36 -3 69 -2 74 3 29 24 125 -7 100 -32 -9 -9 -17 -9 -34
       0 -17 9 -26 8 -46 -5 -29 -19 -30 -31 -4 -70 28 -42 26 -86 -5 -115 -22 -21
       -25 -21 -31 -6 -4 10 -2 22 5 29 17 17 13 52 -9 90 -11 19 -18 41 -14 50 16
       42 -105 25 -152 -22 -95 -93 -56 -267 66 -298 45 -12 46 -37 2 -41 -33 -3 -34
       -4 -27 -40 13 -72 77 -128 117 -103 29 18 48 -2 25 -27 -59 -65 40 -143 149
       -118 54 12 78 48 82 121 4 61 6 65 29 65 15 0 34 -12 50 -30 46 -55 123 -28
       123 43 0 40 -8 53 -43 66 -33 13 -71 0 -89 -29 -14 -22 -72 -29 -83 -10 -4 6
       -14 9 -23 8 -26 -4 -20 15 15 55 l32 37 98 0 c94 0 98 -1 119 -27 16 -21 30
       -27 59 -27 69 0 99 71 50 119 -33 34 -70 32 -105 -5 -28 -30 -30 -30 -129 -30
       l-101 0 0 60 c0 54 2 60 21 60 12 0 34 -13 49 -30 35 -37 72 -39 105 -5 32 31
       32 69 -1 102 -20 20 -31 24 -57 19 -18 -3 -41 -17 -52 -31 -23 -28 -56 -33
       -75 -10 -7 8 -27 17 -46 21 -36 7 -48 34 -14 34 11 0 27 11 36 25 16 24 20 25
       126 25 109 0 110 0 138 -30 35 -37 72 -39 105 -5 39 38 32 86 -15 110 -34 17
       -84 4 -101 -26 -9 -17 -22 -19 -114 -19 l-105 0 0 55 c0 52 2 55 24 55 14 0
       38 -13 54 -30 33 -32 51 -36 85 -19 30 16 37 28 37 66 0 38 -32 73 -68 73 -13
       0 -37 -13 -54 -30 -16 -17 -40 -30 -54 -30 -22 0 -24 4 -24 49 0 27 -4 61 -10
       75 -21 57 -115 83 -187 51z m126 -99 c24 -25 25 -56 4 -63 -7 -3 -17 7 -23 21
       -7 20 -16 26 -40 26 -28 0 -40 17 -23 33 15 15 61 6 82 -17z m231 -60 c28 -35
       -11 -93 -47 -70 -36 22 -23 84 17 84 10 0 23 -7 30 -14z m168 -170 c10 -47
       -60 -64 -80 -20 -11 23 -10 29 11 45 21 17 26 18 45 6 12 -8 22 -22 24 -31z
       m-666 -145 c-2 -21 2 -33 12 -37 25 -10 20 -36 -6 -32 -32 4 -54 52 -39 85 15
       34 37 24 33 -16z m492 23 c29 -29 13 -74 -25 -74 -21 0 -49 26 -49 45 0 7 7
       21 16 29 8 9 22 16 29 16 7 0 21 -7 29 -16z m-206 -119 c10 -10 -8 -34 -23
       -29 -24 10 -63 -4 -70 -25 -3 -10 -1 -30 4 -45 13 -33 0 -71 -30 -86 -33 -18
       -49 4 -21 30 25 23 24 22 16 44 -4 9 -18 16 -33 16 -15 0 -31 3 -34 7 -10 10
       13 33 33 33 10 0 34 16 54 36 31 31 41 36 68 30 17 -3 34 -8 36 -11z m367 -28
       c13 -10 16 -21 11 -40 -8 -34 -41 -44 -67 -21 -23 21 -24 37 -3 58 19 20 35
       20 59 3z m-145 -177 c0 -23 -5 -31 -25 -36 -31 -8 -55 10 -55 43 0 15 8 27 23
       32 32 13 57 -4 57 -39z m-235 -91 c20 -32 -68 -66 -94 -36 -14 18 -4 27 30 27
       15 0 31 5 34 10 8 13 22 13 30 -1z"/>
       <path d="M134 798 c-20 -67 -27 -264 -11 -322 5 -17 57 -79 121 -146 73 -75
       121 -133 134 -163 29 -65 68 -87 155 -87 l67 0 0 118 c0 112 -1 120 -28 163
       -31 48 -90 94 -135 105 -16 3 -55 31 -87 60 -67 62 -105 71 -116 28 -6 -22 3
       -35 62 -95 54 -54 66 -71 56 -81 -10 -10 -27 3 -82 57 -39 39 -73 80 -76 92
       -3 12 2 38 11 57 15 31 16 43 6 79 -9 31 -9 50 -2 70 17 43 13 85 -9 107 -33
       33 -46 24 -66 -42z"/>
       <path d="M1311 844 c-22 -16 -23 -21 -17 -94 4 -48 2 -89 -5 -109 -9 -26 -8
       -35 5 -50 9 -10 16 -33 16 -51 0 -28 -11 -45 -68 -102 -38 -37 -74 -68 -80
       -68 -25 0 -10 27 39 75 62 61 81 94 68 118 -17 30 -55 20 -111 -32 -30 -27
       -79 -61 -109 -74 -113 -51 -149 -117 -149 -272 l0 -105 66 0 c94 0 129 19 162
       89 19 40 57 86 133 161 127 126 134 141 132 295 -1 109 -25 224 -49 232 -5 2
       -20 -4 -33 -13z"/>
       </g>
       </svg>
       `
    }
}

function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};



var token = `Bearer ${getUrlParameter('token')}`

let P = 192 ; // pixels per side
let F = 48  ; // framerate

let DS = 0  ; // default stabilization
let DN = 0  ; // default noise

let S       ; // stabilization parameter
let N       ; // noise         parameter

let sliderS ; // the slider that controls the stabilization parameter
let sliderN ; // the slider that controls the noise         parameter

let cnv     ; // the canvas

let trng    ; // triangular array of blocks
let newt    ; // triangular array, updated
let temp    ; // used to switch trng & newt

let cols    ; // synonym for P,                              indexed by i
let rows    ; // synonym for P,                              indexed by j

let hcs     ; // 1/2 the number of columns (width  of trng), indexed by k
let hrs     ; // 1/2 the number of rows    (height of trng), indexed by l

let i       ; // indexes columns
let j       ; // indexes rows

let k       ; // indexes 1/2-columns
let l       ; // indexes 1/2-rows

let randN   ; // used for storing random numbers for noise
let randS1  ; // used for storing random numbers for stabilization
let randS2  ; // used for storing random numbers for stabilization

let clr0    ; // color 0
let clr1    ; // color 1

//----------------------------------------

function preload()
{
}

//----------------------------------------

function setup()
{
    cols = P                   ; //     width , indexed by i
    rows = P                   ; //     height, indexed by j

    hcs  = floor(cols/2)       ; // 1/2-width , indexed by k
    hrs  = floor(rows/2)       ; // 1/2-height, indexed by l

    trng = new Array(hcs)  ;
     for (k=0; k<hcs; k++) {
         trng[k]
       = new Array(hrs)    ;
                           }

    newt = new Array(hcs)  ;
     for (k=0; k<hcs; k++) {
         newt[k]
       = new Array(hrs)    ;
                           }

    cnv = createCanvas(P,P)             ;
    centerCanvas()                      ;

    clr0 = createColorPicker('#ffffff') ; // creates the first  color picker
    clr1 = createColorPicker('#000000') ; // creates the second color picker

    sliderS = createSlider(0,100,DS,1)  ; // creates the stabilization slider
    sliderS.position(20,50)             ;
    sliderS.style('width', '200px')     ;

    sliderN = createSlider(0,50,DN,0.1) ; // creates the noise slider
    sliderN.position(20,70)             ;
    sliderN.style('width', '200px')     ;

    frameRate(F) ;

    init()       ;
}

//----------------------------------------

function init()                           // randomizes all the blocks
{
    for (k=0; k<hcs; k++)  {
    for (l=0; l<k+1; l++) {
        trng[k][l]
      = floor(random(2))  }}
}

//----------------------------------------

function draw()
{
    S = sliderS.value() ;
    N = sliderN.value() ;

    DrawStep() ;

    temp = trng ;
    trng = newt ;
    newt = temp ;
}

//----------------------------------------

function DrawStep()
{
    for (k=0; k<hcs; k++)  {
    for (l=0; l<k+1; l++) {

        if (trng[k][l] == 0) { stroke(clr0.value()) }
      else                   { stroke(clr1.value()) }

        point (        k ,        l ) ; // 1
        point (        l ,        k ) ; // 8
        point ( cols-1-k ,        l ) ; // 2
        point ( rows-1-l ,        k ) ; // 3
        point ( cols-1-k , rows-1-l ) ; // 5
        point ( rows-1-l , cols-1-k ) ; // 4
        point (        k , rows-1-l ) ; // 6
        point (        l , cols-1-k ) ; // 7
  
 
        switch (octant((2*k)+1,(2*l)+1)) {
            case 1: newt[k][l] = trng[(2*k)+1     ][(2*l)+1     ] ; break;
            case 2: newt[k][l] = trng[cols-2-(2*k)][(2*l)+1     ] ; break;
            case 3: newt[k][l] = trng[(2*l)+1     ][cols-2-(2*k)] ; break;
            case 4: newt[k][l] = trng[rows-2-(2*l)][cols-2-(2*k)] ; break;
            case 5: newt[k][l] = trng[cols-2-(2*k)][rows-2-(2*l)] ; break;
                                         }

        randN  = random(1) ;
        randS1 = random(1) ;
        randS2 = random(1) ;

        if (randN < (N/100)) {
           newt[k][l] = 1 - (newt[k][l])
                             }

        if (randS1 < (S/100)) {

            if ( randS2 < 0.5 )  {
                if ( (newt[k][l] == 1) && (trng[k][l] == 1) ) { }
              else { newt[k][l] = 0 }
                                 }
          else                   {
                if ( (newt[k][l] == 0) && (trng[k][l] == 0) ) { }
              else { newt[k][l] = 1 }
                                 }
                              }
                          }}
}

//----------------------------------------

function centerCanvas()
{
    cnv.position( (windowWidth  - width ) / 2
                , (windowHeight - height) / 2 )
}

//----------------------------------------

function windowResized()
{
    centerCanvas() ;
}

//----------------------------------------

function mousePressed()
{
}

//----------------------------------------
//----------------------------------------

function octant(i,j)
{
    switch (quadrant(i,j)) {
        case 1: if (j-i<1)      {return 1} else {return 8} ; break;
        case 2: if (i+j<cols)   {return 2} else {return 3} ; break;
        case 3: if (i-j<1)      {return 5} else {return 4} ; break;
        case 4: if (i+j>cols-2) {return 6} else {return 7} ; break;
                           }
}

//----------------------------------------

function quadrant(i,j)
{
    switch (side(i)) {
        case 1: if (j<hrs) {return 1} else {return 4} ; break;
        case 2: if (j<hrs) {return 2} else {return 3} ; break;
                     }
}

//----------------------------------------

function side(i)
{
    if (i<hcs) {return 1} else {return 2}
}

//----------------------------------------

function trngEq(xs,ys)
{
    for (k=0; k<hcs; k++)  {
    for (l=0; l<hrs; l++) {
        if (xs[k][l] !== ys[k][l]) {
            return false           }
	                      }}

	return true ;
}

//----------------------------------------

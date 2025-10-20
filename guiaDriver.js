const driver = window.driver.js.driver;


const driverObj = driver({
  showProgress: true,
  steps: [
    { 
        element: '.controls',
        popover: 
        { 
            title: 'controles', 
            description: 'En esta sección se encuentran los controles para personalizar el texto a voz' 
        } 
    },
    { 
        element: '#voz',
        popover: 
        { 
            title: 'Voz', 
            description: 'En esta sección se encuentra la lista desplegable de las voces disponibles y puedes seleccionar la voz que deseas para el texto' 
        } 
    },
    { 
        element: '#emocion',
        popover: 
        { 
            title: 'emocion', 
            description: 'En esta sección se encuentra la lista desplegable de las emociones disponibles y puedes seleccionar la emoción que deseas para el texto, dependiento de la emocion que se elija la entonacion cambia' 
        } 
    },
 { 
        element: '#tono',
        popover: 
        { 
            title: 'tono', 
            description: 'En esta sección se encuentra el control deslizable para ajustar el tono de la voz, para que esta sea mas grave o aguda' 
        } 
    },
    { 
        element: '#velocidad',
        popover: 
        { 
            title: 'velocidad', 
            description: 'En esta sección se encuentra el control deslizable para ajustar la velocidad de la voz, para que esta sea mas lenta o rapida' 
        } 
    },
    { 
        element: '#escuchar',
        popover: 
        { 
            title: 'escuchar', 
            description: 'En esta sección se encuentra el boton para escuchar el texto a voz' 
        } 
    },
    { 
        element: '#descargar',
        popover: 
        { 
            title: 'descargar', 
            description: 'En esta sección se encuentra el boton para descargar el texto a voz' 
        } 
    },
    { 
        element: '#texto',
        popover: 
        { 
            title: 'texto', 
            description: 'En esta sección se encuentra el area de texto donde puedes escribir el texto que deseas convertir a voz' 
        } 
    },
    { 
        element: '#texto',
        popover: 
        { 
            title: 'Muchas Gracias!!', 
            description: 'Gracias por usar el Text-A-Voz, espero que te haya sido de utilidad' 
        } 
    },

  ]
});

driverObj.drive();
// Contenido de los documentos legales (Terminos, Privacidad, Consentimiento
// de fotos). Es el mismo contenido entregado en docs/legal/*.docx para
// revision de un abogado -- esta version vive en el sitio para que la
// dueña de la fundacion pueda verla en el deploy de prueba y decirnos los
// datos reales que faltan (marcados como "Pendiente" abajo, en vez del
// [COMPLETAR] del docx: en el sitio en vivo se ve mejor un chip claro que
// texto entre corchetes).
//
// Los cruces entre documentos (Terminos -> Politica de Privacidad,
// Terminos -> Consentimiento de fotos) ya son links reales a /privacidad y
// /consentimiento-fotos -- eso no puede ser un dato "pendiente", ya existe
// en el codigo.

export type LegalSegment = string | { pending: string } | { link: string; href: string };

interface ParagraphBlock {
  kind: "p";
  segments: LegalSegment[];
}
interface NoteBlock {
  kind: "note";
  segments: LegalSegment[];
}
interface BulletsBlock {
  kind: "bullets";
  items: LegalSegment[][];
}
export type LegalContent = ParagraphBlock | NoteBlock | BulletsBlock;

export interface LegalSection {
  number: number;
  heading: string;
  content: LegalContent[];
}

export interface LegalDoc {
  title: string;
  subtitle: string;
  footerLabel: string;
  sections: LegalSection[];
}

function p(...segments: LegalSegment[]): ParagraphBlock {
  return { kind: "p", segments };
}
function note(...segments: LegalSegment[]): NoteBlock {
  return { kind: "note", segments };
}
function bullets(items: LegalSegment[][]): BulletsBlock {
  return { kind: "bullets", items };
}
function pending(text: string): LegalSegment {
  return { pending: text };
}
function link(text: string, href: string): LegalSegment {
  return { link: text, href };
}

const CONTACTO = "jessica.lagno@peloapelo.cl";

// ============================================================
// TÉRMINOS Y CONDICIONES DE USO
// ============================================================
export const terminosDoc: LegalDoc = {
  title: "Términos y Condiciones de Uso",
  subtitle: "Plataforma digital de acompañamiento en pérdida de cabello",
  footerLabel: "Términos y Condiciones",
  sections: [
    {
      number: 1,
      heading: "Identificación del prestador del servicio",
      content: [
        p(
          'Fundación Pelo a Pelo (en adelante, "la Fundación", "Pelo a Pelo" o "nosotros") es una fundación sin fines de lucro constituida en Chile, RUT ',
          pending("RUT de la Fundación"),
          ", con domicilio en ",
          pending("dirección legal"),
          ", representada por ",
          pending("nombre del representante legal"),
          ", que opera el sitio web y la aplicación de Fundación Pelo a Pelo (en adelante, \"la Plataforma\" o \"el Servicio\"). Para contacto, comunicaciones o ejercicio de derechos, puede escribir a ",
          link(CONTACTO, `mailto:${CONTACTO}`),
          "."
        ),
        p(
          'Al crear una cuenta, suscribirse a un plan o utilizar cualquier funcionalidad de la Plataforma, usted (en adelante, la "Usuaria", el "Usuario" o "usted") declara haber leído, comprendido y aceptado estos Términos y Condiciones, así como la ',
          link("Política de Privacidad", "/privacidad"),
          " y, en caso de activar el módulo correspondiente, el ",
          link("Consentimiento Informado de seguimiento de progreso", "/consentimiento-fotos"),
          ", documentos que forman parte integrante de este acuerdo."
        ),
      ],
    },
    {
      number: 2,
      heading: "Objeto y descripción del Servicio",
      content: [
        p(
          "La Plataforma es un espacio digital de acompañamiento integral para personas que atraviesan procesos de pérdida de cabello (alopecia areata, androgenética, efluvio telógeno, tricotilomanía y otras formas de caída capilar), con un enfoque en tres dimensiones: física, emocional y mental. Según el plan contratado, la Usuaria puede acceder a:"
        ),
        bullets([
          ["Un cuestionario (quiz) inicial de autoevaluación y recomendaciones personalizadas."],
          ["Cursos y lecciones (video, texto y recursos descargables) sobre alopecia, neurociencia del estrés, bienestar emocional y hábitos de autocuidado."],
          [
            "Un módulo de seguimiento de progreso, para registrar fotografías, estado de ánimo y notas personales, y generar reportes para compartir con el equipo médico de la Usuaria (sujeto al ",
            link("Consentimiento Informado", "/consentimiento-fotos"),
            " de la sección 12).",
          ],
          ["Agendamiento de sesiones con profesionales de salud mental vinculados a la Fundación."],
          ["Un ebook y otros recursos descargables de forma gratuita."],
          ["Eventualmente, un espacio de comunidad entre personas usuarias de la Plataforma."],
        ]),
      ],
    },
    {
      number: 3,
      heading: "Naturaleza del Servicio — no es un servicio médico",
      content: [
        p(
          "La Plataforma y sus contenidos tienen un propósito educativo, informativo y de acompañamiento emocional. No constituyen diagnóstico, tratamiento médico, psicológico ni psiquiátrico, y en ningún caso reemplazan la atención de un profesional de la salud debidamente habilitado. Las sesiones con profesionales de salud mental ofrecidas a través de la Plataforma son de carácter orientativo y complementario a un eventual tratamiento clínico formal, y no constituyen una vía de atención de urgencia."
        ),
        note(
          "Si usted se encuentra en una situación de crisis, con ideación suicida o riesgo para su integridad, acuda de inmediato a un servicio de urgencia o contacte una línea de ayuda (en Chile: Salud Responde, 600 360 7777, opción salud mental, disponible las 24 horas). No use la Plataforma como respuesta a una emergencia."
        ),
        p(
          "Cualquier información sobre tratamientos, medicamentos (incluyendo la guía informativa de acceso a Tofacitinib) o alternativas terapéuticas disponible en la Plataforma es de carácter general e informativo, y debe validarse siempre con el médico tratante de la Usuaria antes de tomar cualquier decisión."
        ),
      ],
    },
    {
      number: 4,
      heading: "Requisitos de uso y capacidad",
      content: [
        p(
          "El uso de la Plataforma está dirigido a personas mayores de 18 años con plena capacidad legal para contratar. Las personas entre 14 y 18 años podrán utilizarla únicamente con la autorización y bajo la supervisión de su padre, madre o representante legal, quien deberá aceptar estos Términos en su representación y asumir la responsabilidad derivada del uso del Servicio. La Plataforma no está destinada a menores de 14 años."
        ),
        p(
          "La Fundación se reserva el derecho de solicitar acreditación de la edad o de la representación legal en cualquier momento, y de suspender el acceso mientras dicha acreditación no sea proporcionada."
        ),
      ],
    },
    {
      number: 5,
      heading: "Registro de cuenta",
      content: [
        p(
          "Para acceder a determinadas funcionalidades, la Usuaria debe crear una cuenta con un correo electrónico válido y una contraseña. Es responsable de mantener la confidencialidad de sus credenciales y de toda actividad realizada desde su cuenta, y debe notificar de inmediato a ",
          link(CONTACTO, `mailto:${CONTACTO}`),
          " ante cualquier uso no autorizado."
        ),
        p(
          "La información proporcionada al registrarse debe ser veraz, exacta y actualizada. La Fundación podrá suspender o eliminar cuentas con información falsa o utilizadas de forma contraria a estos Términos."
        ),
      ],
    },
    {
      number: 6,
      heading: "Planes, precios y forma de pago",
      content: [
        p(
          "La Plataforma ofrece, a la fecha de este documento, los siguientes planes (los precios y condiciones vigentes se muestran siempre en la sección de Planes del sitio y prevalecen sobre cualquier referencia anterior):"
        ),
        bullets([
          ["Plan Gratuito: acceso por 3 días sin necesidad de tarjeta de crédito; incluye quiz inicial, seguimiento de progreso y el ebook gratuito."],
          ["Plan 3 Meses: $92.000 CLP por 3 meses (aprox. $1.022 CLP/día); incluye programa estructurado de 3 meses, contenido progresivo semanal, cursos especializados en ansiedad, agenda con terapeuta profesional y garantía de 14 días."],
          ["Plan Mensual: $35.990 CLP por mes (aprox. $1.199 CLP/día); incluye una sesión con terapeuta al mes, acceso a todo el contenido, contenido nuevo cada semana, seguimiento de progreso y comunidad de apoyo."],
        ]),
        p(
          "Los pagos se procesan a través de la pasarela de pago Mercado Pago. La Fundación no almacena los datos completos de tarjetas de pago; dicha información es tratada directamente por el proveedor de pago conforme a sus propias políticas de seguridad."
        ),
        p(
          "Al ser la Fundación una entidad sin fines de lucro, el excedente de los planes pagados se destina a sostener el acceso gratuito o subsidiado de otras personas usuarias a la Plataforma."
        ),
      ],
    },
    {
      number: 7,
      heading: "Renovación, cancelación y derecho a retracto",
      content: [
        p(
          "El Plan Mensual se renueva automáticamente al final de cada período, salvo que la Usuaria lo cancele antes de la fecha de renovación desde su perfil o escribiendo a ",
          link(CONTACTO, `mailto:${CONTACTO}`),
          ". La cancelación no genera devoluciones proporcionales por el período ya iniciado, salvo lo indicado a continuación."
        ),
        p(
          "El Plan 3 Meses cuenta con una garantía de 14 días corridos desde la contratación: si dentro de ese plazo la Usuaria no está conforme con el Servicio, puede solicitar la devolución del monto pagado escribiendo a ",
          link(CONTACTO, `mailto:${CONTACTO}`),
          ", sin necesidad de expresar causa."
        ),
        p(
          "Conforme al artículo 3 bis de la Ley N° 19.496 sobre Protección de los Derechos de los Consumidores, en las contrataciones de servicios celebradas por medios electrónicos la Usuaria tiene derecho a retractarse dentro del plazo legal correspondiente, contado desde la celebración del contrato y antes de que el servicio comience a prestarse. La garantía de 14 días descrita arriba es una condición comercial adicional de la Fundación, y no reemplaza ni restringe este derecho legal."
        ),
      ],
    },
    {
      number: 8,
      heading: "Propiedad intelectual",
      content: [
        p(
          "Todos los contenidos de la Plataforma —textos, cursos, videos, el ebook, ilustraciones, marca, logotipo y diseño— son de propiedad de la Fundación o de terceros que han autorizado su uso, y están protegidos por la normativa de propiedad intelectual e industrial aplicable. Queda prohibida su reproducción, distribución o uso comercial sin autorización previa y por escrito de la Fundación."
        ),
        p(
          "La Usuaria conserva la titularidad de los contenidos que suba a la Plataforma (por ejemplo, las fotografías del módulo de seguimiento de progreso), y otorga a la Fundación una licencia limitada, no exclusiva y revocable para almacenar y procesar dicho contenido con el único fin de prestar el Servicio, en los términos descritos en la ",
          link("Política de Privacidad", "/privacidad"),
          " y en el ",
          link("Consentimiento Informado", "/consentimiento-fotos"),
          " correspondiente."
        ),
      ],
    },
    {
      number: 9,
      heading: "Uso aceptable",
      content: [
        p("La Usuaria se compromete a utilizar la Plataforma de forma respetuosa, absteniéndose de:"),
        bullets([
          ["Publicar contenido que constituya acoso, discriminación o discurso de odio."],
          ["Suplantar la identidad de otra persona."],
          ["Usar la Plataforma con fines comerciales no autorizados."],
          ["Intentar vulnerar la seguridad de la Plataforma o acceder a cuentas de otras personas."],
          ["Subir contenido ilegal, difamatorio o que vulnere derechos de terceros."],
        ]),
        p(
          "El incumplimiento de esta sección faculta a la Fundación para suspender o eliminar la cuenta de la Usuaria, sin perjuicio de las acciones legales que correspondan."
        ),
      ],
    },
    {
      number: 10,
      heading: "Protección de datos personales",
      content: [
        p(
          "El tratamiento de los datos personales de la Usuaria, incluyendo los datos sensibles de salud recabados a través del módulo de seguimiento de progreso y del quiz inicial, se rige por la ",
          link("Política de Privacidad y Tratamiento de Datos Personales", "/privacidad"),
          " de la Fundación y por el ",
          link("Consentimiento Informado", "/consentimiento-fotos"),
          " específico del módulo de fotografías, ambos parte integrante de estos Términos."
        ),
      ],
    },
    {
      number: 11,
      heading: "Limitación de responsabilidad",
      content: [
        p("En la medida permitida por la ley chilena, la Fundación no será responsable por:"),
        bullets([
          ["Resultados específicos derivados del uso del contenido o de los programas de la Plataforma, dado que la evolución de cada proceso de pérdida de cabello depende de factores individuales."],
          ["Decisiones médicas o de tratamiento que la Usuaria adopte con base en la información general disponible en la Plataforma, sin validación de un profesional de la salud."],
          ["Interrupciones del Servicio por causas de fuerza mayor, caso fortuito o fallas de terceros proveedores de infraestructura tecnológica."],
        ]),
        p(
          "Nada en esta sección limita la responsabilidad de la Fundación en los casos en que la ley chilena no permita su limitación o exclusión, incluyendo el dolo o la culpa grave."
        ),
      ],
    },
    {
      number: 12,
      heading: "Consentimiento informado para datos sensibles de salud",
      content: [
        p(
          "El uso del módulo de seguimiento de progreso implica el tratamiento de datos sensibles de salud (fotografías del cuero cabelludo y del cabello, estado de ánimo, tipo de alopecia). Este módulo es voluntario: la Usuaria puede usar el resto de la Plataforma sin activarlo. Antes de subir su primera fotografía, se solicitará un consentimiento informado específico, separado de estos Términos: ",
          link("ver Consentimiento Informado", "/consentimiento-fotos"),
          "."
        ),
      ],
    },
    {
      number: 13,
      heading: "Modificaciones de estos Términos",
      content: [
        p(
          "La Fundación podrá modificar estos Términos para reflejar cambios en el Servicio, en la normativa aplicable o en sus condiciones comerciales. Los cambios sustanciales se notificarán con al menos ",
          pending("N días"),
          " de anticipación por correo electrónico o mediante aviso destacado en la Plataforma. El uso continuado del Servicio después de la entrada en vigencia de los cambios implica su aceptación."
        ),
      ],
    },
    {
      number: 14,
      heading: "Terminación",
      content: [
        p(
          "La Usuaria puede dejar de usar la Plataforma y solicitar la eliminación de su cuenta en cualquier momento, escribiendo a ",
          link(CONTACTO, `mailto:${CONTACTO}`),
          ". La Fundación podrá suspender o terminar el acceso de una Usuaria que incumpla gravemente estos Términos, previa comunicación cuando las circunstancias lo permitan."
        ),
      ],
    },
    {
      number: 15,
      heading: "Legislación aplicable y resolución de controversias",
      content: [
        p(
          "Estos Términos se rigen por las leyes de la República de Chile. Cualquier controversia derivada de su interpretación o aplicación se someterá a los tribunales ordinarios de justicia de ",
          pending("ciudad, ej. Santiago"),
          ", sin perjuicio de los derechos que asisten a la Usuaria como consumidora conforme a la Ley N° 19.496, incluyendo la posibilidad de recurrir al Servicio Nacional del Consumidor (SERNAC)."
        ),
      ],
    },
    {
      number: 16,
      heading: "Contacto",
      content: [
        p(
          "Para consultas, ejercicio de derechos o reclamos relacionados con estos Términos, escriba a ",
          link(CONTACTO, `mailto:${CONTACTO}`),
          "."
        ),
      ],
    },
  ],
};

// ============================================================
// POLÍTICA DE PRIVACIDAD
// ============================================================
export const privacidadDoc: LegalDoc = {
  title: "Política de Privacidad y Tratamiento de Datos Personales",
  subtitle: "Cómo recopilamos, usamos y protegemos su información",
  footerLabel: "Política de Privacidad",
  sections: [
    {
      number: 1,
      heading: "Responsable del tratamiento",
      content: [
        p(
          "El responsable del tratamiento de los datos personales recabados a través de la Plataforma es Fundación Pelo a Pelo, RUT ",
          pending("RUT de la Fundación"),
          ", con domicilio en ",
          pending("dirección legal"),
          ", Chile. Para ejercer sus derechos o realizar consultas sobre esta Política, puede escribir a ",
          link(CONTACTO, `mailto:${CONTACTO}`),
          "."
        ),
      ],
    },
    {
      number: 2,
      heading: "Normativa aplicable",
      content: [
        p(
          "Esta Política se elabora conforme a la Ley N° 19.628 sobre Protección de la Vida Privada, actualmente vigente en Chile, y se ha diseñado considerando los estándares de la Ley N° 21.719, que moderniza el régimen de protección de datos personales, crea la Agencia de Protección de Datos Personales y entrará en vigencia el 1 de diciembre de 2026. La Fundación revisará y actualizará esta Política antes de esa fecha para asegurar su pleno cumplimiento."
        ),
      ],
    },
    {
      number: 3,
      heading: "Datos que recopilamos",
      content: [
        bullets([
          ["Datos de identificación y contacto: nombre, correo electrónico y otros datos que la Usuaria decida entregar en su perfil."],
          ["Datos de cuenta: credenciales de acceso (la contraseña se almacena cifrada) e historial de sesión."],
          ["Datos de salud (categoría especial / datos sensibles): respuestas al quiz inicial (tipo de alopecia, impacto emocional percibido), fotografías del cuero cabelludo y del cabello subidas en el módulo de seguimiento de progreso, registros de estado de ánimo y notas personales asociadas, e información compartida durante sesiones con profesionales de salud mental."],
          ["Datos de pago: no almacenamos números de tarjeta ni datos financieros completos; son procesados directamente por Mercado Pago. Conservamos únicamente el estado de la transacción (aprobada, rechazada, plan contratado) y el monto."],
          ["Datos de uso: interacción con la Plataforma, cursos completados y progreso en los programas, con fines de personalización."],
        ]),
      ],
    },
    {
      number: 4,
      heading: "Datos sensibles: tratamiento reforzado",
      content: [
        p(
          "Los datos de salud descritos en el punto anterior constituyen datos sensibles conforme a la legislación chilena, por referirse a la salud física y psicológica de la Usuaria. Estos datos: (i) sólo se recaban con su consentimiento previo, libre, informado y específico; (ii) se someten a medidas de seguridad reforzadas; (iii) no se utilizan con fines publicitarios ni se comparten con terceros ajenos a la prestación del Servicio; (iv) pueden ser eliminados por la Usuaria en cualquier momento, conforme a la sección 10 de esta Política."
        ),
        p(
          "El módulo de fotografías de seguimiento cuenta, además, con un ",
          link("Consentimiento Informado", "/consentimiento-fotos"),
          " específico que la Usuaria debe aceptar antes de subir su primera fotografía."
        ),
      ],
    },
    {
      number: 5,
      heading: "Finalidades del tratamiento",
      content: [
        p("Utilizamos los datos personales para:"),
        bullets([
          ["Crear y administrar la cuenta de la Usuaria."],
          ["Prestar los servicios contratados (cursos, seguimiento de progreso, agendamiento de sesiones)."],
          ["Generar recomendaciones y contenido personalizado según el tipo de alopecia y el progreso reportado."],
          ["Generar, a solicitud de la Usuaria, reportes de evolución para compartir con su equipo médico tratante."],
          ["Procesar pagos y gestionar suscripciones."],
          ["Enviar comunicaciones relacionadas con el Servicio."],
          ["Mejorar la Plataforma mediante estadísticas agregadas y anonimizadas."],
          ["Cumplir obligaciones legales."],
        ]),
      ],
    },
    {
      number: 6,
      heading: "Base de licitud",
      content: [
        p(
          "El tratamiento de datos de identificación, cuenta y pago se basa en la ejecución del contrato de prestación de servicios que la Usuaria acepta al registrarse. El tratamiento de datos sensibles de salud se basa en su consentimiento explícito, libre e informado, el cual puede revocar en cualquier momento sin que ello afecte la licitud del tratamiento previo a la revocación."
        ),
      ],
    },
    {
      number: 7,
      heading: "Con quién compartimos su información",
      content: [
        p("No vendemos ni arrendamos datos personales a terceros. Compartimos información únicamente en los siguientes casos:"),
        bullets([
          ["Con los profesionales de salud mental vinculados a la Fundación, cuando la Usuaria agenda una sesión, y sólo la información necesaria para dicha atención."],
          ["Con Mercado Pago, para el procesamiento de pagos."],
          ["Con los proveedores de infraestructura tecnológica que alojan la Plataforma (base de datos y aplicación web), quienes actúan como encargados del tratamiento bajo instrucciones de la Fundación y obligaciones de confidencialidad."],
          ["Con el equipo médico de la Usuaria, únicamente cuando ella genere y comparta activamente un reporte desde la Plataforma."],
          ["Cuando exista una obligación legal o un requerimiento de autoridad competente."],
        ]),
      ],
    },
    {
      number: 8,
      heading: "Transferencias internacionales",
      content: [
        p(
          "La infraestructura tecnológica que aloja la Plataforma (base de datos y aplicación web) puede alojar los datos fuera de Chile. En dichos casos, la Fundación adopta medidas contractuales y técnicas razonables para asegurar que los datos reciban un nivel de protección equivalente al exigido por la legislación chilena."
        ),
      ],
    },
    {
      number: 9,
      heading: "Plazo de conservación",
      content: [
        p(
          "Conservamos los datos personales mientras la cuenta de la Usuaria esté activa y durante el plazo adicional necesario para cumplir obligaciones legales, contables o tributarias. Las fotografías del módulo de seguimiento se conservan mientras la Usuaria no solicite su eliminación o la de su cuenta, momento en el cual se eliminan de forma segura dentro de un plazo de ",
          pending("N días"),
          "."
        ),
      ],
    },
    {
      number: 10,
      heading: "Derechos de la Usuaria (ARCO y portabilidad)",
      content: [
        p(
          "La Usuaria puede ejercer en cualquier momento sus derechos de Acceso (conocer qué datos tenemos sobre usted), Rectificación (corregir datos inexactos), Cancelación/Eliminación (solicitar la eliminación de sus datos, incluyendo fotografías), Oposición (oponerse a un tratamiento específico) y Portabilidad (solicitar sus datos en un formato estructurado). Para ejercerlos, escriba a ",
          link(CONTACTO, `mailto:${CONTACTO}`),
          " indicando el derecho que desea ejercer; responderemos dentro de los plazos legales aplicables."
        ),
      ],
    },
    {
      number: 11,
      heading: "Seguridad de la información",
      content: [
        p(
          "Implementamos medidas técnicas y organizativas razonables para proteger los datos personales frente a accesos no autorizados, pérdida o alteración, incluyendo cifrado de contraseñas, control de acceso y comunicaciones cifradas (HTTPS). Ningún sistema es enteramente infalible; ante cualquier incidente de seguridad que afecte datos personales, notificaremos a las autoridades y a las personas afectadas conforme a la normativa aplicable."
        ),
      ],
    },
    {
      number: 12,
      heading: "Menores de edad",
      content: [
        p(
          "Conforme a los Términos y Condiciones, el uso de la Plataforma por personas entre 14 y 18 años requiere autorización de su padre, madre o representante legal, quien también deberá consentir el tratamiento de los datos personales del menor. La Plataforma no está dirigida a menores de 14 años y no recaba deliberadamente sus datos."
        ),
      ],
    },
    {
      number: 13,
      heading: "Cookies y tecnologías similares",
      content: [
        p(
          "El sitio web de la Fundación puede utilizar cookies esenciales para su funcionamiento y, en su caso, cookies de análisis para comprender el uso de la Plataforma. ",
          pending("detallar cookies de terceros / analítica y banner de consentimiento, si aplica")
        ),
      ],
    },
    {
      number: 14,
      heading: "Cambios a esta Política",
      content: [
        p(
          "Esta Política podrá actualizarse para reflejar cambios normativos o en nuestras prácticas. La versión vigente estará siempre disponible en la Plataforma, indicando la fecha de la última actualización."
        ),
      ],
    },
    {
      number: 15,
      heading: "Contacto y reclamos",
      content: [
        p(
          "Para consultas o reclamos sobre el tratamiento de sus datos personales, escriba a ",
          link(CONTACTO, `mailto:${CONTACTO}`),
          ". Una vez vigente la Ley N° 21.719, la Usuaria también podrá presentar reclamos ante la Agencia de Protección de Datos Personales de Chile."
        ),
      ],
    },
  ],
};

// ============================================================
// CONSENTIMIENTO INFORMADO — MÓDULO DE FOTOS DE PROGRESO
// ============================================================
export const consentimientoDoc: LegalDoc = {
  title: "Consentimiento Informado",
  subtitle: "Módulo de seguimiento fotográfico de progreso",
  footerLabel: "Consentimiento Informado — Fotos de Progreso",
  sections: [
    {
      number: 0,
      heading: "",
      content: [
        p(
          "Antes de activar el módulo de seguimiento de progreso, por favor lea con atención la siguiente información. Este módulo implica el tratamiento de datos sensibles de salud (fotografías de su cuero cabelludo y cabello), por lo que requiere su consentimiento expreso, independiente de los ",
          link("Términos y Condiciones", "/terminos"),
          " generales de la Plataforma."
        ),
      ],
    },
    {
      number: 1,
      heading: "¿Qué le pedimos?",
      content: [
        p(
          "Le invitamos a subir, de forma voluntaria y periódica, fotografías de su cuero cabelludo y/o cabello, junto con notas sobre su estado de ánimo, para llevar un registro visual de su evolución a lo largo del tiempo."
        ),
      ],
    },
    {
      number: 2,
      heading: "¿Para qué usamos estas fotografías?",
      content: [
        bullets([
          ["Para que usted pueda visualizar su propia evolución dentro de la Plataforma (comparativas en el tiempo)."],
          ["Para generar reportes que usted puede descargar y compartir voluntariamente con su médico u otro profesional de salud."],
          ["Para que herramientas de análisis con inteligencia artificial le ayuden a identificar cambios visuales relevantes en su cuero cabelludo a lo largo del tiempo. Este análisis es un apoyo informativo y no constituye un diagnóstico médico."],
        ]),
      ],
    },
    {
      number: 3,
      heading: "¿Es obligatorio?",
      content: [
        p(
          "No. El módulo de seguimiento de progreso es completamente voluntario. Usted puede usar el resto de la Plataforma (cursos, quiz, agendamiento de sesiones) sin subir ninguna fotografía."
        ),
      ],
    },
    {
      number: 4,
      heading: "¿Quién puede ver mis fotografías?",
      content: [
        p("Sus fotografías son privadas por defecto. Solo usted puede verlas dentro de su cuenta. La Fundación no las comparte con terceros, salvo:"),
        bullets([
          ["Que usted decida activamente generar y compartir un reporte con su médico u otra persona."],
          ["El personal técnico estrictamente necesario para el funcionamiento y soporte de la Plataforma, sujeto a obligaciones de confidencialidad."],
          ["Que exista una obligación legal que nos obligue a ello."],
        ]),
      ],
    },
    {
      number: 5,
      heading: "¿Dónde se almacenan?",
      content: [
        p(
          "Sus fotografías se almacenan de forma cifrada en la infraestructura tecnológica que da soporte a la Plataforma (base de datos y aplicación web), que puede alojar los datos fuera de Chile — ver sección de Transferencias Internacionales de la ",
          link("Política de Privacidad", "/privacidad"),
          "."
        ),
      ],
    },
    {
      number: 6,
      heading: "¿Puedo eliminar mis fotografías?",
      content: [
        p(
          "Sí, en cualquier momento, desde la sección de Progreso de su cuenta, o solicitándolo a ",
          link(CONTACTO, `mailto:${CONTACTO}`),
          ". La eliminación es permanente y no reversible."
        ),
      ],
    },
    {
      number: 7,
      heading: "¿Puedo retirar mi consentimiento?",
      content: [
        p(
          "Sí. Puede desactivar el módulo de seguimiento de progreso y solicitar la eliminación de todas sus fotografías en cualquier momento, sin que esto afecte su acceso al resto de la Plataforma ni implique ninguna penalidad."
        ),
      ],
    },
    {
      number: 8,
      heading: "Declaración de consentimiento",
      content: [
        p('Al marcar "Acepto" o al subir su primera fotografía en el módulo de seguimiento de progreso, usted declara que:'),
        bullets([
          ["Ha leído y comprendido este documento."],
          ["Es mayor de 18 años, o cuenta con la autorización expresa de su padre, madre o representante legal."],
          ["Consiente de forma libre, específica e informada el tratamiento de sus fotografías y datos de salud asociados, para las finalidades descritas en este documento."],
          ["Comprende que puede revocar este consentimiento en cualquier momento, según lo indicado en el punto 7."],
        ]),
      ],
    },
  ],
};

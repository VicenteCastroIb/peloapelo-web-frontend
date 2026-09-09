import { ALL_ALOPECIA_CODES } from "@/lib/data/alopeciaTypes";
import { calcularResultadoQuiz, type QuizAnswer } from "./scoring";

// a(1, "q1_sudden") -> { questionId: 1, optionId: "q1_sudden" }
const a = (questionId: number, optionId: string): QuizAnswer => ({ questionId, optionId });

describe("calcularResultadoQuiz", () => {
  describe("resultados concluyentes", () => {
    it("areata clásica: inicio súbito + parches + uñas + autoinmune", () => {
      const result = calcularResultadoQuiz([
        a(1, "q1_sudden"), // AREATA +2
        a(2, "q2_patches"), // AREATA +3
        a(3, "q3_never"), // 0
        a(4, "q4_no"), // 0
        a(5, "q5_yes"), // AREATA +2
        a(6, "q6_no"), // 0
        a(7, "q7_yes"), // AREATA +2
        a(8, "q8_patches"), // AREATA +1
        a(9, "q9_yes_no_pulling"), // AREATA +2
        a(10, "q10_yes"), // AREATA +1
      ]);

      expect(result.status).toBe("CONCLUSIVE");
      expect(result.primaryType).toBe("AREATA");
      expect(result.topTypes).toEqual(["AREATA"]);
      expect(result.scores).toEqual({
        AREATA: 13,
        ANDROGENETICA: 0,
        EFLUVIO_TELOGENO: 0,
        TRICOTILOMANIA: 0,
      });
      expect(result.totalPoints).toBe(13);
    });

    it("androgenética: inicio gradual + patrón + familia + pérdida lenta", () => {
      const result = calcularResultadoQuiz([
        a(1, "q1_gradual"), // AG +3
        a(2, "q2_pattern"), // AG +3
        a(4, "q4_yes"), // AG +2
        a(8, "q8_slow"), // AG +2
      ]);

      expect(result.status).toBe("CONCLUSIVE");
      expect(result.primaryType).toBe("ANDROGENETICA");
      expect(result.topTypes).toEqual(["ANDROGENETICA"]);
      expect(result.scores.ANDROGENETICA).toBe(10);
      expect(result.totalPoints).toBe(10);
    });

    it("efluvio telógeno: gatillante + caída difusa + mechones", () => {
      const result = calcularResultadoQuiz([
        a(1, "q1_trigger"), // TE +3
        a(2, "q2_diffuse"), // TE +2
        a(6, "q6_yes"), // TE +3
        a(8, "q8_handfuls"), // TE +2
      ]);

      expect(result.status).toBe("CONCLUSIVE");
      expect(result.primaryType).toBe("EFLUVIO_TELOGENO");
      expect(result.scores.EFLUVIO_TELOGENO).toBe(10);
    });

    it("tricotilomanía: arrancado frecuente + zonas irregulares + cejas/pestañas", () => {
      const result = calcularResultadoQuiz([
        a(2, "q2_irregular"), // TR +3
        a(3, "q3_often"), // TR +4
        a(9, "q9_yes_pulling"), // TR +2
      ]);

      expect(result.status).toBe("CONCLUSIVE");
      expect(result.primaryType).toBe("TRICOTILOMANIA");
      expect(result.scores.TRICOTILOMANIA).toBe(9);
    });

    it("basta con 3 puntos y un único líder para ser concluyente", () => {
      const result = calcularResultadoQuiz([
        a(1, "q1_sudden"), // AREATA +2
        a(10, "q10_yes"), // AREATA +1
      ]);

      expect(result.status).toBe("CONCLUSIVE");
      expect(result.primaryType).toBe("AREATA");
      expect(result.totalPoints).toBe(3);
    });

    it("cuando es concluyente, topTypes es exactamente [primaryType]", () => {
      const result = calcularResultadoQuiz([a(1, "q1_gradual"), a(2, "q2_pattern")]);
      expect(result.primaryType).not.toBeNull();
      expect(result.topTypes).toEqual([result.primaryType]);
    });
  });

  describe("resultados no concluyentes", () => {
    it("sin señal (todo 'no sé' / 'no'): no fuerza categoría", () => {
      const result = calcularResultadoQuiz([
        a(1, "q1_unsure"),
        a(3, "q3_never"),
        a(4, "q4_no"),
        a(5, "q5_no"),
        a(6, "q6_no"),
        a(7, "q7_no"),
        a(9, "q9_no"),
        a(10, "q10_no"),
      ]);

      expect(result.status).toBe("INCONCLUSIVE");
      expect(result.primaryType).toBeNull();
      expect(result.topTypes).toEqual([]);
      expect(result.totalPoints).toBe(0);
    });

    it("puntaje total muy bajo (<= 2) no alcanza para orientar", () => {
      const result = calcularResultadoQuiz([
        a(1, "q1_unsure"), // 0
        a(8, "q8_patches"), // AREATA +1
        a(10, "q10_yes"), // AREATA +1
      ]);

      expect(result.status).toBe("INCONCLUSIVE");
      expect(result.primaryType).toBeNull();
      expect(result.totalPoints).toBe(2);
      // Se muestran los 1-2 tipos más cercanos, aunque no se comprometa uno.
      expect(result.topTypes).toEqual(["AREATA"]);
    });

    it("empate arriba entre dos tipos: no concluyente, con ambos como cercanos", () => {
      const result = calcularResultadoQuiz([
        a(2, "q2_diffuse"), // TE +2
        a(8, "q8_slow"), // AG +2
      ]);

      expect(result.status).toBe("INCONCLUSIVE");
      expect(result.primaryType).toBeNull();
      // Orden estable segun ALL_ALOPECIA_CODES: ANDROGENETICA antes que EFLUVIO_TELOGENO.
      expect(result.topTypes).toEqual(["ANDROGENETICA", "EFLUVIO_TELOGENO"]);
      expect(result.scores.ANDROGENETICA).toBe(2);
      expect(result.scores.EFLUVIO_TELOGENO).toBe(2);
    });

    it("sin respuestas", () => {
      const result = calcularResultadoQuiz([]);
      expect(result.status).toBe("INCONCLUSIVE");
      expect(result.primaryType).toBeNull();
      expect(result.topTypes).toEqual([]);
      expect(result.totalPoints).toBe(0);
      expect(result.scores).toEqual({
        AREATA: 0,
        ANDROGENETICA: 0,
        EFLUVIO_TELOGENO: 0,
        TRICOTILOMANIA: 0,
      });
    });
  });

  describe("robustez", () => {
    it("ignora preguntas y opciones desconocidas", () => {
      const result = calcularResultadoQuiz([
        a(999, "no-existe"),
        a(1, "opcion-inventada"),
        a(1, "q1_gradual"), // AG +3
        a(2, "q2_pattern"), // AG +3
      ]);

      expect(result.status).toBe("CONCLUSIVE");
      expect(result.primaryType).toBe("ANDROGENETICA");
      expect(result.totalPoints).toBe(6);
    });

    it("es determinista: la misma entrada da el mismo resultado", () => {
      const answers = [a(1, "q1_sudden"), a(2, "q2_patches"), a(3, "q3_sometimes")];
      expect(calcularResultadoQuiz(answers)).toEqual(calcularResultadoQuiz(answers));
    });

    it("scores siempre trae las 4 categorías", () => {
      const result = calcularResultadoQuiz([a(1, "q1_sudden")]);
      expect(Object.keys(result.scores).sort()).toEqual([...ALL_ALOPECIA_CODES].sort());
    });
  });
});

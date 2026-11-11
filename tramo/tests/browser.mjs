import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
const browser = await chromium.launch({
  executablePath: "/usr/bin/chromium",
  headless: true,
  args: ["--no-sandbox"],
});
try {
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } }),
      errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.route("**/.netlify/functions/tramo-api/capabilities", (r) =>
      r.fulfill({ json: { tracking: false, email: false, push: false } }),
    );
    await page.goto("http://localhost:5173/tramo/");
    assert.equal(
      await page.getByRole("heading", { level: 1 }).textContent(),
      "Tus paquetes,en cada tramo.",
    );
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
    );
    await page
      .getByRole("button", { name: "Prueba la demo", exact: true })
      .click();
    await page.getByRole("button", { name: /Algo para perderse/ }).click();
    assert.equal(
      await page.getByRole("heading", { name: "Cada paso cuenta" }).count(),
      1,
    );
    await page
      .getByRole("button", { name: "Ver ubicaciones", exact: true })
      .click();
    assert.equal(
      await page.getByRole("link", { name: /León · 42.6/ }).count(),
      1,
    );
    await page.getByRole("button", { name: "Cerrar detalle" }).click();
    await page
      .getByRole("button", { name: "Añadir paquete", exact: true })
      .click();
    await page
      .getByRole("textbox", { name: "¿Cómo lo llamamos?" })
      .fill("Mi paquete de prueba");
    await page
      .getByRole("textbox", { name: "Número de seguimiento", exact: true })
      .fill("PRUEBA0001");
    await page
      .getByRole("button", { name: "Guardar paquete", exact: true })
      .click();
    assert.equal(
      await page
        .getByRole("heading", { name: "Mi paquete de prueba", exact: true })
        .count(),
      2,
    );
    await page
      .getByRole("button", { name: "Eliminar paquete", exact: true })
      .click();
    await page
      .getByRole("dialog")
      .getByRole("button", { name: "Eliminar paquete", exact: true })
      .click();
    assert.equal(
      await page
        .getByRole("heading", { name: "Mi paquete de prueba", exact: true })
        .count(),
      0,
    );
    await page
      .getByRole("textbox", { name: "Buscar en mis paquetes" })
      .fill("Audio");
    assert.equal(await page.locator(".package-card").count(), 1);
    await page
      .getByRole("textbox", { name: "Buscar en mis paquetes" })
      .fill("");
    await page.getByRole("button", { name: "Entregados", exact: true }).click();
    assert.equal(await page.locator(".package-card").count(), 1);
    if (width < 760)
      await page.getByRole("button", { name: "Abrir menú" }).click();
    await page
      .getByRole("button", { name: "Notificaciones", exact: true })
      .click();
    await page.getByRole("switch", { name: "Avisos por correo" }).uncheck();
    assert.equal(
      await page.getByRole("switch", { name: "Avisos por correo" }).isChecked(),
      false,
    );
    await page
      .getByRole("button", { name: "Activar notificaciones", exact: true })
      .click();
    assert.match(
      await page.getByRole("status").textContent(),
      /La demo no solicita permisos/,
    );
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
    );
    await page.goto("http://localhost:5173/tramo/app");
    await page.waitForURL("**/tramo/acceder");
    assert.equal(
      await page.getByRole("textbox", { name: "Correo electrónico" }).count(),
      1,
    );
    await page
      .getByRole("button", { name: "Crea tu cuenta", exact: true })
      .click();
    assert.equal(
      await page
        .getByRole("heading", { name: "Hazle sitio a tus paquetes." })
        .count(),
      1,
    );
    assert.deepEqual(errors, []);
    console.log(
      `PASS: navigation, privacy gate, demo CRUD, map, filters and preferences at ${width}px`,
    );
    await page.close();
  }
} finally {
  await browser.close();
}

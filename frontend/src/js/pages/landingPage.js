import React from 'react';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Textarea } from '@components/ui/textarea';
import { Card, CardContent } from '@components/ui/card';
import { Check } from 'lucide-react';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white text-gray-800">
      {/* Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 items-center px-6 lg:px-24 py-16 gap-8">
        <div>
          <h1 className="text-4xl lg:text-6xl font-bold mb-4 leading-tight">
            Suplementación y Rutas Personalizadas
          </h1>
          <p className="text-lg lg:text-xl mb-6">
            Obtén tu rutina de entrenamiento y plan de nutrición diseñado por entrenadores expertos,
            con seguimiento continuo para maximizar tus resultados.
          </p>
          <Button size="lg" className="rounded-2xl">
            ¡Solicita Tu Plan Hoy!
          </Button>
        </div>
        <div>
          <img
            src="/images/hero-fit.jpg"
            alt="Deportista entrenando"
            className="rounded-2xl shadow-lg"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16 px-6 lg:px-24">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-semibold mb-4">¿Qué Ofrecemos?</h2>
          <p className="text-gray-600">
            Desde musculación hasta ejercicios funcionales y vida saludable, cubrimos todas tus necesidades.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {['Entrenamiento Personalizado', 'Plan Nutricional', 'Seguimiento 24/7'].map((feature) => (
            <Card key={feature} className="shadow-sm rounded-2xl">
              <CardContent className="flex flex-col items-center p-6">
                <Check className="w-10 h-10 mb-4 text-green-500" />
                <h3 className="text-xl font-medium mb-2">{feature}</h3>
                <p className="text-gray-600 text-center">
                  {feature === 'Entrenamiento Personalizado'
                    ? 'Rutinas adaptadas a tu nivel y objetivos.'
                    : feature === 'Plan Nutricional'
                    ? 'Dietas equilibradas diseñadas por nutricionistas.'
                    : 'Soporte y ajustes constantes para tu progreso.'}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Call-to-Action Form */}
      <section className="bg-green-100 py-16 px-6 lg:px-24">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Solicita Tu Plan Personalizado
          </h2>
          <form className="space-y-4">
            <Input type="text" placeholder="Nombre completo" />
            <Input type="email" placeholder="Correo electrónico" />
            <Input type="tel" placeholder="Teléfono" />
            <Textarea placeholder="Cuéntanos tus objetivos y experiencia" rows={4} />
            <Button type="submit" className="w-full rounded-2xl">
              Enviar Solicitud
            </Button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-6">
        <div className="max-w-4xl mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} SuplementoFit. Todos los derechos reservados.</p>
          <p className="mt-2 text-sm">
            Síguenos en redes: Facebook | Instagram | YouTube
          </p>
        </div>
      </footer>
    </main>
  );
}

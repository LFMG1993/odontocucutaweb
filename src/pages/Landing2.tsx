import React, { useState } from 'react';

// Tipado para las sedes de OdontoCúcuta
interface Sede {
    id: string;
    nombre: string;
    direccion: string;
    telefono?: string;
    celular: string;
    horario: string;
    mapaEmbed: string;
}

export default function LandingPage2() {
    const [sedeSeleccionada, setSedeSeleccionada] = useState<string>('caobos');
    const [modalAbierto, setModalAbierto] = useState<boolean>(false);
    const [mensajeEnviado, setMensajeEnviado] = useState<boolean>(false);
    const [formData, setFormData] = useState({
        nombre: '',
        celular: '',
        sede: 'caobos',
        servicio: 'valoracion'
    });

    // Sedes de OdontoCúcuta basadas en datos reales
    const sedes: Record<string, Sede> = {
        caobos: {
            id: 'caobos',
            nombre: 'Sede Principal Los Caobos',
            direccion: 'Avenida 3E # 13A-07, Barrio Los Caobos, Cúcuta',
            telefono: '(607) 595-5068',
            celular: '3181441442',
            horario: 'Lunes a Sábado: 7:30 AM - 12:00 PM y 2:00 PM - 7:00 PM',
            mapaEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.146208343513!2d-72.49964142512684!3d7.880824905305141!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e513a201c107f9f%3A0xe543e2646c243ee7!2sCl%C3%ADnica%20Odontoc%C3%BAcuta!5e0!3m2!1ses-419!2sco!4v1786060000000!5m2!1ses-419!2sco'
        },
        atalaya: {
            id: 'atalaya',
            nombre: 'Sede Atalaya',
            direccion: 'Manzana M5 Lote 19, Primera Etapa, Atalaya, Cúcuta',
            telefono: '(607) 501-0370',
            celular: '3164682016',
            horario: 'Lunes a Sábado: 7:30 AM - 12:00 PM y 2:00 PM - 7:00 PM',
            mapaEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15808.287265977926!2d-72.540000!3d7.890000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e51390000000000%3A0x0000000000000000!2sAtalaya%20Cucuta!5e0!3m2!1ses-419!2sco!4v1786060000001!5m2!1ses-419!2sco'
        },
        libertad: {
            id: 'libertad',
            nombre: 'Sede La Libertad',
            direccion: 'Avenida Principal No. 15a-08, Barrio La Libertad, Cúcuta',
            telefono: '(607) 501-0331',
            celular: '3164714020',
            horario: 'Lunes a Sábado: 7:30 AM - 12:00 PM y 2:00 PM - 7:00 PM',
            mapaEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15808.5!2d-72.48!3d7.87!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e513b!2sLa%20Libertad%20Cucuta!5e0!3m2!1ses-419!2sco!4v1786060000002!5m2!1ses-419!2sco'
        },
        pamplona: {
            id: 'pamplona',
            nombre: 'Sede Pamplona',
            direccion: 'Avenida Santander, Condominio Almeida, Torre B Esquina, Pamplona',
            celular: '3125216991',
            horario: 'Lunes a Sábado: 8:00 AM - 12:00 PM y 2:00 PM - 7:00 PM',
            mapaEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3958.5582319202865!2d-72.65171!3d7.37359!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e51e18000000000%3A0x0000000000000000!2sPamplona%20Norte%20de%20Santander!5e0!3m2!1ses-419!2sco!4v1786060000003!5m2!1ses-419!2sco'
        }
    };

    const currentSede = sedes[sedeSeleccionada];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulación de envío de datos
        setMensajeEnviado(true);
        setTimeout(() => {
            setModalAbierto(false);
            setMensajeEnviado(false);
            setFormData({ nombre: '', celular: '', sede: 'caobos', servicio: 'valoracion' });
        }, 2500);
    };

    const generateWhatsappUrl = (sedeCel: string, text: string) => {
        return `https://wa.me/57${sedeCel.replace(/\s+/g, '')}?text=${encodeURIComponent(text)}`;
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased">

            {/* 🚨 BANNER DE URGENCIAS ESTILO "ODONTOLOGÍA 24 HORAS" */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white text-center py-2 px-4 text-sm font-semibold sticky top-0 z-50 shadow-md flex items-center justify-center gap-2">
                <span className="animate-ping inline-block w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
                <span>¿Dolor fuerte o Emergencia Dental? Atendemos Urgencias Odontológicas.</span>
                <a
                    href={generateWhatsappUrl(currentSede.celular, "¡Hola! Tengo una urgencia dental y necesito atención inmediata.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white text-red-700 px-3 py-1 rounded-full text-xs font-bold hover:bg-slate-100 transition shadow"
                >
                    ¡Contactar Ya!
                </a>
            </div>

            {/* 🧭 HEADER / NAVEGACIÓN SIMPLIFICADA */}
            <header className="bg-white/95 backdrop-blur-md sticky top-[38px] z-40 border-b border-slate-200 shadow-sm transition-all">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-600 text-white p-2.5 rounded-xl shadow-md shadow-blue-200">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <div>
                            <span className="text-xl font-black text-slate-900 tracking-tight block">ODONTOCÚCUTA</span>
                            <span className="text-xs font-semibold text-blue-600 tracking-wider uppercase block">Clínica Odontológica</span>
                        </div>
                    </div>

                    <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
                        <a href="#especialidades" className="hover:text-blue-600 transition">Especialidades</a>
                        <a href="#afiliacion" className="hover:text-blue-600 transition">Planes de Afiliación</a>
                        <a href="#sedes" className="hover:text-blue-600 transition">Nuestras Sedes</a>
                        <a href="#contacto" className="hover:text-blue-600 transition">Convenios</a>
                    </nav>

                    <button
                        onClick={() => setModalAbierto(true)}
                        className="bg-blue-600 text-white font-bold px-5 py-2.5 rounded-full hover:bg-blue-700 shadow-lg shadow-blue-100 hover:shadow-blue-200 transition text-sm"
                    >
                        Agendar Valoración
                    </button>
                </div>
            </header>

            {/* 🚀 HERO SECTION (CONFIANZA +30 AÑOS Y CONVERSIÓN) */}
            <section className="relative overflow-hidden bg-white pt-10 pb-20 lg:pt-20 lg:pb-32 border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-12 gap-12 items-center">

                        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700">
                ⭐ Más de 30 años sonriendo contigo (Desde 1992)
              </span>
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                                La clínica dental de confianza en <span className="text-blue-600">Norte de Santander</span>
                            </h1>
                            <p className="text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0">
                                Cuidamos de tu sonrisa y la de tu familia con tecnología de punta y especialistas en todas las áreas. Visítanos en cualquiera de nuestras 4 sedes en Cúcuta y Pamplona.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                                <button
                                    onClick={() => setModalAbierto(true)}
                                    className="bg-blue-600 text-white font-extrabold px-8 py-4 rounded-xl hover:bg-blue-700 shadow-xl shadow-blue-200 hover:shadow-none transition-all text-base"
                                >
                                    Reservar Cita de Valoración
                                </button>
                                <a
                                    href={generateWhatsappUrl(currentSede.celular, "Hola, me gustaría recibir información sobre una consulta general.")}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-2 border-2 border-emerald-500 bg-emerald-50 text-emerald-700 font-extrabold px-8 py-4 rounded-xl hover:bg-emerald-100 transition-all text-base"
                                >
                                    {/* Icono de WhatsApp */}
                                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.45L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.528 1.989 14.076 1.01 11.99 1.01c-5.438 0-9.863 4.372-9.867 9.802-.001 1.74.475 3.442 1.378 4.912L2.457 20.89l5.19-1.736z"/>
                                    </svg>
                                    Atención por WhatsApp
                                </a>
                            </div>
                        </div>

                        <div className="lg:col-span-5 relative">
                            <div className="relative w-full max-w-md mx-auto aspect-square bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl overflow-hidden shadow-2xl">
                                <div className="absolute inset-0 flex items-center justify-center text-white text-center p-6">
                                    <div>
                                        <span className="text-7xl block mb-4">🦷</span>
                                        <span className="text-2xl font-black block">Tecnología Láser</span>
                                        <span className="text-sm opacity-90 block mt-2">Instalaciones modernas avaladas por el Ministerio de Salud</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* 📊 SECCIÓN DE CONFIDENCIALIDAD / ESTADÍSTICAS */}
            <section className="bg-slate-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                        <div>
                            <span className="text-3xl sm:text-4xl font-black text-blue-400 block">+30</span>
                            <span className="text-xs sm:text-sm text-slate-400 font-medium uppercase tracking-wider block mt-1">Años de Trayectoria</span>
                        </div>
                        <div>
                            <span className="text-3xl sm:text-4xl font-black text-blue-400 block">4</span>
                            <span className="text-xs sm:text-sm text-slate-400 font-medium uppercase tracking-wider block mt-1">Sedes Regionales</span>
                        </div>
                        <div>
                            <span className="text-3xl sm:text-4xl font-black text-blue-400 block">+15</span>
                            <span className="text-xs sm:text-sm text-slate-400 font-medium uppercase tracking-wider block mt-1">Especialistas</span>
                        </div>
                        <div>
                            <span className="text-3xl sm:text-4xl font-black text-blue-400 block">100%</span>
                            <span className="text-xs sm:text-sm text-slate-400 font-medium uppercase tracking-wider block mt-1">Habilitada por Minsalud</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* 🏥 SECCIÓN ESPECIALIDADES (ESTILO DENTISALUD: ENFOQUE COMERCIAL) */}
            <section id="especialidades" className="py-20 lg:py-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                        <span className="text-blue-600 font-bold text-sm uppercase tracking-wider">Servicios Integrales</span>
                        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Especialidades que Transforman Sonrisas</h2>
                        <p className="text-slate-600 text-lg">Ofrecemos tratamientos avanzados de la mano de un equipo médico idóneo y certificado.</p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Especialidad 1 */}
                        <div className="bg-white p-8 rounded-2xl border border-slate-100 hover:border-blue-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <span className="text-4xl block mb-6">✨</span>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Ortodoncia</h3>
                            <p className="text-slate-600 text-sm leading-relaxed mb-4">Alineación de dientes con brackets estéticos, metálicos y tecnología moderna invisible para lograr la mordida perfecta.</p>
                            <button onClick={() => setModalAbierto(true)} className="text-blue-600 font-bold text-sm inline-flex items-center gap-1.5 hover:text-blue-700">
                                Saber más <span className="text-lg">→</span>
                            </button>
                        </div>

                        {/* Especialidad 2 */}
                        <div className="bg-white p-8 rounded-2xl border border-slate-100 hover:border-blue-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <span className="text-4xl block mb-6">💎</span>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Implantología Oral</h3>
                            <p className="text-slate-600 text-sm leading-relaxed mb-4">Recupera la estética y funcionalidad de tus dientes de manera segura y definitiva con implantes dentales de alta calidad.</p>
                            <button onClick={() => setModalAbierto(true)} className="text-blue-600 font-bold text-sm inline-flex items-center gap-1.5 hover:text-blue-700">
                                Saber más <span className="text-lg">→</span>
                            </button>
                        </div>

                        {/* Especialidad 3 */}
                        <div className="bg-white p-8 rounded-2xl border border-slate-100 hover:border-blue-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <span className="text-4xl block mb-6">👶</span>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Odontopediatría</h3>
                            <p className="text-slate-600 text-sm leading-relaxed mb-4">Especialistas dedicados a cuidar de la salud oral de los más pequeños en un ambiente amigable y libre de temor.</p>
                            <button onClick={() => setModalAbierto(true)} className="text-blue-600 font-bold text-sm inline-flex items-center gap-1.5 hover:text-blue-700">
                                Saber más <span className="text-lg">→</span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* 💳 SECCIÓN PLAN DE AFILIACIÓN ANUAL */}
            <section id="afiliacion" className="bg-blue-600 text-white py-20 lg:py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-700/30 opacity-50"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-12 gap-12 items-center">
                        <div className="lg:col-span-6 space-y-6">
                            <span className="bg-blue-500 text-white font-bold text-xs uppercase tracking-wider px-3 py-1.5 rounded-full">Exclusivo de OdontoCúcuta</span>
                            <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">Planes de Afiliación Anual y Financiación Directa</h2>
                            <p className="text-blue-100 text-lg">
                                Diseñamos planes de financiamiento a tu medida para que el cuidado dental de tu familia no afecte tu bolsillo. Disfruta de beneficios inmediatos, limpiezas y tarifas preferenciales.
                            </p>
                            <ul className="space-y-3 font-semibold text-blue-50">
                                <li className="flex items-center gap-2">✓ Sin cuotas de interés bancarias molestas</li>
                                <li className="flex items-center gap-2">✓ Financiación anual aprobada de forma directa</li>
                                <li className="flex items-center gap-2">✓ Tarifas preferenciales para ti y tus beneficiarios</li>
                            </ul>
                        </div>
                        <div className="lg:col-span-6">
                            <div className="bg-white text-slate-800 p-8 rounded-3xl shadow-xl max-w-md mx-auto space-y-6">
                                <h3 className="text-2xl font-bold text-slate-900 text-center">Consulta de Afiliación</h3>
                                <p className="text-sm text-slate-500 text-center">Déjanos tus datos y un asesor te explicará los beneficios de afiliación anual de inmediato.</p>
                                <form onSubmit={handleFormSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nombre Completo</label>
                                        <input type="text" required className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="Ej: Maria Perez" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Celular de contacto</label>
                                        <input type="tel" required className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="Ej: 312 456 7890" />
                                    </div>
                                    <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl transition text-sm shadow-md">
                                        Solicitar Información
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 🗺️ INTERACTIVIDAD DE SEDES (LA PIEZA CLAVE DE CONVERSIÓN REGIONAL) */}
            <section id="sedes" className="py-20 lg:py-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                        <span className="text-blue-600 font-bold text-sm uppercase tracking-wider">Cercanía y Comodidad</span>
                        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Nuestras 4 Sedes Habilitadas</h2>
                        <p className="text-slate-600 text-lg">Selecciona la sede más cercana a ti para ver la información de contacto y ubicación exacta en tiempo real.</p>
                    </div>

                    {/* Selector de Tabs */}
                    <div className="flex flex-wrap gap-2 justify-center mb-10">
                        {Object.keys(sedes).map((key) => (
                            <button
                                key={key}
                                onClick={() => setSedeSeleccionada(key)}
                                className={`px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${
                                    sedeSeleccionada === key
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-100'
                                        : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                                }`}
                            >
                                {sedes[key].nombre.split(' ')[1] || sedes[key].nombre}
                            </button>
                        ))}
                    </div>

                    {/* Panel Informativo de Sede Dinámica */}
                    <div className="bg-white rounded-3xl border border-slate-100 p-8 lg:p-12 shadow-sm grid lg:grid-cols-12 gap-12">
                        <div className="lg:col-span-5 space-y-6">
                            <h3 className="text-2xl font-black text-slate-900">{currentSede.nombre}</h3>

                            <div className="space-y-4 text-slate-600 text-sm">
                                <div className="flex items-start gap-3">
                                    <span className="text-lg mt-0.5">📍</span>
                                    <p className="font-medium">{currentSede.direccion}</p>
                                </div>
                                {currentSede.telefono && (
                                    <div className="flex items-start gap-3">
                                        <span className="text-lg mt-0.5">📞</span>
                                        <p className="font-semibold">PBX: {currentSede.telefono}</p>
                                    </div>
                                )}
                                <div className="flex items-start gap-3">
                                    <span className="text-lg mt-0.5">📱</span>
                                    <p className="font-semibold">WhatsApp: {currentSede.celular}</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="text-lg mt-0.5">🕒</span>
                                    <div>
                                        <p className="font-semibold">Horario de Atención:</p>
                                        <p className="text-slate-500">{currentSede.horario}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <a
                                    href={generateWhatsappUrl(currentSede.celular, `Hola, me gustaría agendar una cita de valoración en la Sede de ${currentSede.nombre}`)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all inline-flex items-center gap-2"
                                >
                                    Agendar en esta Sede
                                </a>
                            </div>
                        </div>

                        <div className="lg:col-span-7 bg-slate-100 rounded-2xl overflow-hidden aspect-video border border-slate-200 min-h-[300px]">
                            <iframe
                                title={`Ubicación de ${currentSede.nombre}`}
                                src={currentSede.mapaEmbed}
                                className="w-full h-full border-none"
                                allowFullScreen={true}
                                loading="lazy"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </section>

            {/* 📁 FOOTER ORGANIZADO (SITUACIÓN LEGAL Y REQUISITOS) */}
            <footer className="bg-slate-900 text-slate-400 py-16 border-t border-slate-800 text-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-4 gap-10">
                    <div className="space-y-4">
                        <span className="text-lg font-black text-white tracking-tight">ODONTOCÚCUTA S.A.</span>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Clínica odontológica con más de 30 años de experiencia, brindando salud oral integral de alta calidad en Norte de Santander y Santander.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-4">Especialidades</h4>
                        <ul className="space-y-2 text-xs">
                            <li>Ortodoncia</li>
                            <li>Implantología</li>
                            <li>Odontopediatría</li>
                            <li>Rehabilitación Oral</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-4">Información para Pacientes</h4>
                        <ul className="space-y-2 text-xs">
                            <li className="hover:text-white transition cursor-pointer">Cuidados Postoperatorios</li>
                            <li className="hover:text-white transition cursor-pointer">Seguridad del Paciente</li>
                            <li className="hover:text-white transition cursor-pointer">Derechos y Deberes</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-4">Transparencia</h4>
                        <ul className="space-y-2 text-xs">
                            <li className="hover:text-white transition cursor-pointer">Protección de Datos Personales</li>
                            <li className="hover:text-white transition cursor-pointer">Estados Financieros de la Sociedad</li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
                    <p>© 2026 OdontoCúcuta S.A. Todos los derechos reservados. Habilitado por el Ministerio de Salud y Protección Social de Colombia.</p>
                </div>
            </footer>

            {/* 🟢 BOTÓN DE WHATSAPP FLOTANTE PERMANENTE */}
            <a
                href={generateWhatsappUrl(currentSede.celular, `Hola, me comunico desde la página web y quiero solicitar una cita para valoración dental.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-6 right-6 bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-200 z-50 flex items-center justify-center"
            >
                <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.45L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.528 1.989 14.076 1.01 11.99 1.01c-5.438 0-9.863 4.372-9.867 9.802-.001 1.74.475 3.442 1.378 4.912L2.457 20.89l5.19-1.736z"/>
                </svg>
            </a>

            {/* 📑 MODAL DE AGENDAMIENTO (REDUCCIÓN DE FRICCIÓN) */}
            {modalAbierto && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-lg p-8 relative shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <button
                            onClick={() => setModalAbierto(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition text-2xl"
                        >
                            ✕
                        </button>

                        {mensajeEnviado ? (
                            <div className="text-center py-12 space-y-4">
                                <span className="text-5xl block animate-bounce">🎉</span>
                                <h3 className="text-2xl font-bold text-slate-900">¡Solicitud Registrada!</h3>
                                <p className="text-slate-600 text-sm">Tu cita de valoración está siendo procesada. Un asesor se comunicará con tu celular de inmediato.</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="text-center space-y-2">
                                    <h3 className="text-2xl font-black text-slate-900">Agenda tu Valoración</h3>
                                    <p className="text-sm text-slate-500">Completa tus datos básicos para asignarte un especialista certificado.</p>
                                </div>

                                <form onSubmit={handleFormSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Tu Nombre</label>
                                        <input
                                            type="text"
                                            name="nombre"
                                            value={formData.nombre}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                            placeholder="Ej: Laura Castro"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Número de Celular</label>
                                        <input
                                            type="tel"
                                            name="celular"
                                            value={formData.celular}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                            placeholder="Ej: 315 123 4567"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Sede</label>
                                            <select
                                                name="sede"
                                                value={formData.sede}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm"
                                            >
                                                <option value="caobos">Los Caobos</option>
                                                <option value="atalaya">Atalaya</option>
                                                <option value="libertad">La Libertad</option>
                                                <option value="pamplona">Pamplona</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Especialidad</label>
                                            <select
                                                name="servicio"
                                                value={formData.servicio}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm"
                                            >
                                                <option value="valoracion">Valoración General</option>
                                                <option value="ortodoncia">Ortodoncia</option>
                                                <option value="implantes">Implantes Dentales</option>
                                                <option value="odontopediatria">Odontopediatría</option>
                                            </select>
                                        </div>
                                    </div>
                                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 rounded-xl transition text-base shadow-lg shadow-blue-100 mt-4">
                                        Confirmar Agendamiento
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            )}

        </div>
    );
}
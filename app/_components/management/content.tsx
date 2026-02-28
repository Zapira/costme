'use client';
import { useState } from "react";
import Modal from "../ui/modal";
import Title from "../ui/title";

export default function Content() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    return (
        <>
            <div>
                <Title onClick={() => setIsModalOpen(true)}>Manajemen Keuangan</Title>
                <p className="text-gray-600">Fitur ini masih dalam pengembangan. Harap bersabar ya!</p>
            </div>
            <Modal isOpen={isModalOpen} setIsOpen={setIsModalOpen} >
                <Title>Fitur Belum Tersedia</Title>
                <p className="text-gray-600">Fitur manajemen keuangan sedang dalam tahap pengembangan. Kami akan segera merilisnya. Terima kasih atas pengertiannya!</p>
            </Modal>
        </>

    )
}
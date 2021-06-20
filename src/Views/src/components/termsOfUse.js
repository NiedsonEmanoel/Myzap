import React from 'react'

export default function TermsOfUse(props) {
    const Name = props.Name
    return (
        <>
            <p>O usuário se compromete a fazer uso adequado dos conteúdos e da informação que o site {Name} oferece e com caráter enunciativo, mas não limitativo:</p>

            <ul>
                <li>A) Não se envolver em atividades que sejam ilegais ou contrárias à boa fé e à ordem pública;</li>
                <li>B) Não difundir propaganda ou conteúdo de natureza racista, xenofóbica, casas de apostas, jogos de sorte e azar, qualquer tipo de pornografia ilegal, de apologia ao terrorismo ou contra os direitos humanos;</li>
                <li>C) Não causar danos aos sistemas físicos (hardwares) e lógicos (softwares) do site {Name}, de seus fornecedores ou terceiros, para introduzir ou disseminar vírus informáticos ou quaisquer outros sistemas de hardware ou software que sejam capazes de causar danos anteriormente mencionados.</li>
            </ul>
        </>
    );
}
import Image from "next/image";

const MatchNote = () => (
  <div className="match-note-content">
    <ul className="note-list">
      <li>
        <Image src="/images/goal-regular.svg" alt="" width={16} height={16} />
        <span className="text">Ghi bàn</span>
      </li>
      <li>
        <Image src="/images/corner.svg" alt="" width={16} height={16} />
        <span className="text">Phạt góc</span>
      </li>
      <li>
        <Image src="/images/cards.svg" alt="" width={16} height={16} />
        <span className="text">Thẻ</span>
      </li>
      <li>
        <Image src="/images/chart.svg" alt="" width={20} height={20} />
        <span className="text">Tấn công</span>
      </li>
    </ul>
  </div>
);

export default MatchNote;

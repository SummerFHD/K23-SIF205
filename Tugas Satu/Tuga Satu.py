def buat_file_soal_baru():
    with open('soal.txt', 'w') as file:
        print("Masukkan soal pertama")
        tambah_soal()  # Menambahkan soal pertama saat file baru dibuat
    print("File soal baru berhasil dibuat.")

def tambah_soal():
    with open('soal.txt', 'a') as file:
        file.write('#\n')
        pertanyaan = input("Masukkan pertanyaan: ")
        file.write(pertanyaan + '\n')
        
        for option in ['a', 'b', 'c', 'd', 'e']:
            pilihan = input(f"Masukkan pilihan {option}: ")
            file.write(f"{option}. {pilihan}\n")
        
        file.write('*\n')
        kunci = input("Masukkan kunci jawaban (a/b/c/d/e): ")
        file.write(kunci + '\n')
        file.write('##\n')
    
    print("Soal berhasil ditambahkan.")

def lihat_semua_soal():
    try:
        with open('soal.txt', 'r') as file:
            print(file.read())
    except FileNotFoundError:
        print("File soal tidak ditemukan. Silakan buat file soal baru terlebih dahulu.")

def main_menu():
    print("Selamat datang di aplikasi ujian mobile")
    print("1. Buat file soal baru")
    print("2. Tambahkan soal")
    print("3. Lihat semua soal")
    print("4. Keluar")
    
    choice = input("Masukkan pilihan: ")
    
    if choice == '1':
        buat_file_soal_baru()
    elif choice == '2':
        tambah_soal()
    elif choice == '3':
        lihat_semua_soal()
    elif choice == '4':
        print("Keluar dari program.")
    else:
        print("Pilihan tidak valid.")
    
if __name__ == "__main__":
    while True:
        main_menu()

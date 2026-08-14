# STEP DASAR SET UP ARSITEKTUR NEST 
    # Untuk membuat module bernama user
    nest g module user

    # Untuk membuat controller user
    nest g controller user

    # Untuk membuat services user
    nest g service user

# INTERCEPTOR 
    #  Digunakan untuk handle result response dengan data dan juga metadata
    nest g interceptor utils/transform --flat


# MIDDLEWARE
    # 
    nest g middleware middleware/api-key --flat

# GUARD 
    # Guard Dijalankan setelah middleware dia bertugas menentukan apakah req tersebut layak di lanjutkan atau false
    nest g guard guards/role --flat